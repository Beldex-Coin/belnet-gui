/* eslint-disable @typescript-eslint/no-explicit-any */

import Electron from 'electron';
const { ipcRenderer } = Electron;
import _ from 'lodash';
import crypto from 'crypto';
import {
  DEBUG_IPC_CALLS,
  IPC_CHANNEL_KEY,
  IPC_GLOBAL_ERROR,
  IPC_LOG_LINE,
  StatusErrorType
} from '../../sharedIpc';
import { appendToAppLogsOutsideRedux, setErrorOutsideRedux } from '../app/app';

const IPC_UPDATE_TIMEOUT = 10000;
// getSummaryStatus is polled: a hung status call should fail fast so the next
// poll can try again, instead of blocking the UI state for 10s.
const IPC_TIMEOUT_BY_FN: Record<string, number> = {
  getSummaryStatus: 5000,
  // addExit only answers once the daemon has finished the whole sequence:
  // for a BNS name that is LookupNameAsync over the network, then
  // EnsurePathToService (5s), then auth. Observed BNS swaps regularly
  // exceeded 12s, producing false timeouts on swaps that had succeeded.
  // Must stay below the main-process JOB_TTL_MS or the reply gets swept
  // before it lands.
  addExit: 20000,
  // two providers tried in turn, 5s each in the main process
  fetchIpAddress: 12000
};

const channelsFromRendererToMainToMake = {
  // rpc calls (zeromq calls)
  getSummaryStatus,
  addExit,
  deleteExit,
  setConfig,
  // belnet process manager calls
  doStopBelnetProcess,
  // utility calls
  markRendererReady,
  minimizeToTray,
  probeExitNodeLatencies,
  fetchIpAddress
};
const channels = {} as any;
const _jobs = Object.create(null);

export const POLLING_STATUS_INTERVAL_MS = 2000;

// shutting down clean handling
let _shuttingDown = false;
let _shutdownCallback: any = null;
let _shutdownPromise: any = null;

export async function getSummaryStatus(): Promise<string> {
  return channels.getSummaryStatus();
}
export async function addExit(
  exitAddress: string,
  exitToken?: string
): Promise<string> {
  console.info(
    `Triggering exit node set with node ${exitAddress}.`
  );
  return channels.addExit(exitAddress, exitToken);
}

export async function deleteExit(): Promise<string> {
  return channels.deleteExit();
}

export async function doStopBelnetProcess(): Promise<string | null> {
  return channels.doStopBelnetProcess();
}

export async function markRendererReady(): Promise<void> {
  channels.markRendererReady();
}

export async function minimizeToTray(type: string): Promise<void> {
  channels.minimizeToTray(type);
}

/**
 * Asks the main process to measure TCP connect latency to the given hosts.
 * Returns a map of host -> latency in ms, or null when unreachable/unresolvable.
 */
export async function probeExitNodeLatencies(
  hosts: Array<string>
): Promise<Record<string, number | null>> {
  const resultJson = await channels.probeExitNodeLatencies(
    JSON.stringify(hosts)
  );
  try {
    return JSON.parse(resultJson) || {};
  } catch (e) {
    console.info('probeExitNodeLatencies: could not parse reply', e);
    return {};
  }
}
export type IpInfo = {
  ip: string;
  /** Country name as reported by the lookup provider, e.g. "Netherlands". */
  country?: string;
  /** ISO 3166-1 alpha-2 code, e.g. "NL". */
  countryCode?: string;
  /** Approximate location of the IP, from the lookup provider. */
  latitude?: number;
  longitude?: number;
};

/**
 * Asks the main process which IP address this machine currently appears from
 * on the internet (the public IP before connecting, the exit node's IP after),
 * along with the country that address is located in.
 * Throws if no provider answered.
 */
export async function fetchIpInfo(): Promise<IpInfo> {
  const replyJson = await channels.fetchIpAddress();
  let reply: {
    ip?: string;
    country?: string;
    countryCode?: string;
    latitude?: number;
    longitude?: number;
    error?: string;
  } = {};
  try {
    reply = JSON.parse(replyJson) || {};
  } catch (e) {
    throw new Error('fetchIpAddress: could not parse reply');
  }
  if (!reply.ip) {
    throw new Error(reply.error || 'fetchIpAddress: no ip in reply');
  }
  return {
    ip: reply.ip,
    country: reply.country || undefined,
    countryCode: reply.countryCode || undefined,
    latitude: typeof reply.latitude === 'number' ? reply.latitude : undefined,
    longitude: typeof reply.longitude === 'number' ? reply.longitude : undefined
  };
}

/** Same as fetchIpInfo, address only. */
export async function fetchIpAddress(): Promise<string> {
  return (await fetchIpInfo()).ip;
}

export async function setConfig(
  section: string,
  key: string,
  value: string
): Promise<string> {
  return channels.setConfig(section, key, value);
}

export async function initializeIpcRendererSide(): Promise<void> {
  // We listen to a lot of events on ipcRenderer, often on the same channel. This prevents
  //   any warnings that might be sent to the console in that case.
  ipcRenderer.setMaxListeners(0);

  // The channel name MUST come from the object key, never from `fn.name`.
  // `fn.name` is a minifier-visible identifier: a production build renames
  // these functions, which silently renames every channel and breaks the whole
  // renderer <-> main bridge (callers still ask for `channels.getSummaryStatus`
  // while the registry holds `channels.k`). The keys below are string literals
  // and are never mangled, so they are the only safe source of truth.
  _.forEach(channelsFromRendererToMainToMake, (fn, fnName) => {
    if (_.isFunction(fn)) {
      makeChannel(fnName);
    }
  });

  ipcRenderer.on(IPC_LOG_LINE, (_event, logLine: string) => {
    if (_.isString(logLine) && !_.isEmpty(logLine)) {
      appendToAppLogsOutsideRedux(logLine);
    }
  });

  ipcRenderer.on(IPC_GLOBAL_ERROR, (_event, globalError: StatusErrorType) => {
    setErrorOutsideRedux(globalError);
  });

  ipcRenderer.on(
    `${IPC_CHANNEL_KEY}-done`,
    (event, jobId, errorForDisplay, result: string | null) => {
      const job = _getJob(jobId);
      if (!job) {
        console.info(
          `Received IPC channel reply to job ${jobId}, but did not have it in our registry!`
        );
        return;
      }
      const { resolve, reject, fnName } = job;

      if (errorForDisplay) {
        return reject(
          new Error(
            `Error received from IPC channel job ${jobId} (${fnName}): ${errorForDisplay}`
          )
        );
      }

      return resolve(result);
    }
  );

  channels.markRendererReady();
}

async function _shutdown() {
  if (_shutdownPromise) {
    return _shutdownPromise;
  }

  _shuttingDown = true;

  const jobKeys = Object.keys(_jobs);
  console.log(
    `data.shutdown: starting process. ${jobKeys.length} jobs outstanding`
  );

  // No outstanding jobs, return immediately
  if (jobKeys.length === 0) {
    return null;
  }

  // Outstanding jobs; we need to wait until the last one is done
  _shutdownPromise = new Promise((resolve, reject) => {
    _shutdownCallback = (error: any) => {
      console.log('data.shutdown: process complete');
      if (error) {
        return reject(error);
      }

      return resolve(undefined);
    };
  });

  return _shutdownPromise;
}

function _makeJob(fnName: string) {
  if (_shuttingDown && fnName !== 'closeRpcConnection') {
    throw new Error(
      `Rejecting IPC channel job (${fnName}); application is shutting down`
    );
  }

  const jobId = crypto.randomBytes(15).toString('hex');

  _jobs[jobId] = {
    fnName
  };

  return jobId;
}

function _updateJob(id: string, data: any) {
  const { resolve, reject } = data;

  _jobs[id] = {
    ..._jobs[id],
    ...data,
    resolve: (value: any) => {
      _removeJob(id);
      return resolve(value);
    },
    reject: (error: any) => {
      _removeJob(id);
      return reject(error);
    }
  };
}

function _removeJob(id: string) {
  if (_jobs[id].timer) {
    clearTimeout(_jobs[id].timer);
    _jobs[id].timer = null;
  }

  // tslint:disable-next-line: no-dynamic-delete
  delete _jobs[id];

  if (_shutdownCallback) {
    const keys = Object.keys(_jobs);
    if (keys.length === 0) {
      _shutdownCallback();
    }
  }
}

function _getJob(id: string) {
  return _jobs[id];
}

function makeChannel(fnName: string) {
  channels[fnName] = async (...args: any) => {
    const jobId = _makeJob(fnName);

    return new Promise((resolve, reject) => {
      ipcRenderer.send(IPC_CHANNEL_KEY, jobId, fnName, ...args);

      _updateJob(jobId, {
        resolve,
        reject,
        args: DEBUG_IPC_CALLS ? args : null
      });

      _jobs[jobId].timer = setTimeout(() => {
        const logline = `IPC channel job ${jobId}: ${fnName} timed out at ${Date.now()}`;
        appendToAppLogsOutsideRedux(logline);
        reject(new Error(logline));
      }, IPC_TIMEOUT_BY_FN[fnName] || IPC_UPDATE_TIMEOUT);
    });
  };
}

export async function shutdown(): Promise<void> {
  // Stop accepting new SQL jobs, flush outstanding queue
  await _shutdown();
  await closeRpcConnection();
}
// Note: will need to restart the app after calling this, to set up afresh
export async function closeRpcConnection(): Promise<void> {
  await channels.closeRpcConnection();
}

export interface DaemonSummaryStatus {
  isRunning: boolean;
  globalError: StatusErrorType;
  uptime?: number;
  version?: string;
  numPeersConnected: number;
  uploadUsage: number;
  downloadUsage: number;
  beldexAddress: string;
  numPathsBuilt: number;
  numRoutersKnown: number;
  ratio: string;
  exitNode?: string;
  exitAuthCode?: string;
}

export const defaultDaemonSummaryStatus: Readonly<DaemonSummaryStatus> = Object.freeze({
  isRunning: false,
  globalError: undefined,
  uptime: undefined,
  version: undefined,
  numPeersConnected: 0,
  uploadUsage: 0,
  downloadUsage: 0,
  beldexAddress: '',
  numPathsBuilt: 0,
  numRoutersKnown: 0,
  ratio: '',
  exitNode: undefined,
  exitAuthCode: undefined
});

export const parseSummaryStatus = (
  payload: string,
  error?: string
): DaemonSummaryStatus => {
  let stats = null;

  if (!payload || _.isEmpty(payload)) {
    console.info('Empty payload for summary status');
    return { ...defaultDaemonSummaryStatus };
  }

  // We can either have an error of communication, or an error on the returned JSON
  if (!error) {
    try {
      stats = JSON.parse(payload);
    } catch (e) {
      console.log("Couldn't parse 'summaryStatus' JSON-RPC payload", e);
    }
  }
  // if we got an error, just return isRunning false.
  // the redux store will reset all values to their default.
  if (error || !stats || stats.error) {
    console.info('We got an error for Status: ', error || stats?.error);
    return { ...defaultDaemonSummaryStatus };
  }
  const statsResult = stats.result;
  // never reuse the shared default object: it must stay pristine
  const parsedSummaryStatus: DaemonSummaryStatus = {
    ...defaultDaemonSummaryStatus
  };

  if (!statsResult || _.isEmpty(statsResult)) {
    console.info('We got an empty statsResult');
    return parsedSummaryStatus;
  }

  parsedSummaryStatus.numPeersConnected = statsResult.numPeersConnected;
  // txRate/rxRate are per-second rates reported by the daemon.
  // We keep them as bytes/second: the speed history stores one point per poll.
  parsedSummaryStatus.uploadUsage = statsResult.txRate || 0;
  parsedSummaryStatus.downloadUsage = statsResult.rxRate || 0;

  parsedSummaryStatus.isRunning = statsResult.running || false;
  parsedSummaryStatus.numRoutersKnown = statsResult.numRoutersKnown || 0;

  parsedSummaryStatus.beldexAddress = statsResult.beldexAddress || '';
  parsedSummaryStatus.uptime = statsResult.uptime || 0;
  parsedSummaryStatus.version = statsResult.version || '';

  const exitMap = statsResult.exitMap;
  if (exitMap) {
    // exitMap should be of length 1 only, but it's an object with keys an IP (not as string)
    // so easier to parse it like this
    for (const k in exitMap) {
      parsedSummaryStatus.exitNode = exitMap[k];
    }
  } else {
    parsedSummaryStatus.exitNode = undefined;
  }
  const authCodes = statsResult?.authCodes || undefined;

  if (authCodes) {
    for (const beldexExit in authCodes) {
      const auth = statsResult?.authCodes[beldexExit];
      parsedSummaryStatus.exitAuthCode = auth;
    }
  } else {
    parsedSummaryStatus.exitAuthCode = undefined;
  }

  parsedSummaryStatus.ratio = `${Math.ceil(statsResult?.ratio * 100 || 0)}%`;

  parsedSummaryStatus.numPathsBuilt = statsResult.numPathsBuilt;
  return parsedSummaryStatus;
};

