/* eslint-disable @typescript-eslint/no-explicit-any */
import * as _zmq from 'zeromq/';

_zmq.context.blocky = false;

import { takeEventByJobId } from './ipcNode';
import { IPC_CHANNEL_KEY } from './sharedIpc';

const RPC_BOUND_PORT = 1190;
const RPC_BOUND_IP = '127.0.0.1';
const RPC_ZMQ_ADDRESS = `tcp://${RPC_BOUND_IP}:${RPC_BOUND_PORT}`;

const RECONNECT_BACKOFF_START_MS = 1000;
const RECONNECT_BACKOFF_MAX_MS = 30000;

let dealer: any; // ZeroMqDealer

let isRunning = false;
let reconnectTimer: NodeJS.Timeout | null = null;
let reconnectBackoffMs = RECONNECT_BACKOFF_START_MS;

const request = async (
  cmd: string,
  reply_tag: string,
  args: string
): Promise<void> => {
  if (!cmd) {
    throw new Error(`Missing cmd`);
  }
  if (!reply_tag) {
    throw new Error(`You must use a reply tag for cmd ${cmd}`);
  }
  if (!dealer) {
    throw new Error(`RPC dealer is not connected (cmd ${cmd})`);
  }
  await dealer.send([cmd, reply_tag, args]);
};

// BelnetApiClient::invoke
const invoke = async (
  endpoint: string,
  reply_tag: string,
  args: Record<string, unknown>
) => {
  const argsStringified = JSON.stringify(args);
  await request(endpoint, reply_tag, argsStringified);
};

export const getSummaryStatus = async (reply_tag: string): Promise<void> => {
  await invoke('llarp.get_status', reply_tag, {});
};

export const addExit = async (
  reply_tag: string,
  exitAddress: string,
  exitToken?: string
): Promise<void> => {
  if (exitToken) {
    await invoke('llarp.exit', reply_tag, {
      exit: exitAddress,
      token: exitToken
    });
  } else {
    await invoke('llarp.exit', reply_tag, { exit: exitAddress });
  }
};

export const deleteExit = async (reply_tag: string): Promise<void> => {
  await invoke('llarp.exit', reply_tag, { unmap: true });
};

export const setConfig = async (
  reply_tag: string,
  section: string,
  key: string,
  value: string
): Promise<void> => {
  const obj: { [k: string]: any } = {};
  const config: { [k: string]: string } = {};
  config[key] = value;
  obj[section] = config;
  await invoke('llarp.config', reply_tag, { override: obj, reload: true });
};

export const closeRpcConnection = (): void => {
  isRunning = false;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  console.info('stopping rpc dealer');
  if (dealer) {
    try {
      dealer.close();
      dealer = null;
    } catch (e) {
      console.info(e);
    }
  }
};

/**
 * Handle a single multipart reply coming from the daemon.
 * Never throws: a malformed reply must not kill the receive loop.
 */
const handleReply = (reply: Array<Buffer>): void => {
  try {
    if (reply.length !== 3) {
      console.warn('RPC: got an invalid reply of length', reply.length);
      return;
    }
    const replyType = reply[0].toString('utf8');
    if (replyType !== 'REPLY') {
      console.warn(`RPC: got an unexpected reply type "${replyType}"`);
      return;
    }
    const jobId = reply[1].toString('utf8');
    const content = reply[2].toString('utf8');
    const event = takeEventByJobId(jobId);

    if (!event) {
      // the renderer side probably timed this job out already: just drop it.
      console.warn(`RPC: no pending event for jobId ${jobId}, dropping reply`);
      return;
    }
    event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, content);
  } catch (e) {
    console.warn('RPC: failed to handle a reply, continuing:', e);
  }
};

const createDealer = (): void => {
  if (dealer) {
    try {
      dealer.close();
    } catch (e) {
      console.info(e);
    }
  }
  dealer = new _zmq.Dealer({ sendTimeout: 10000 });
};

const scheduleReconnect = (): void => {
  if (!isRunning || reconnectTimer) {
    return;
  }
  const delay = reconnectBackoffMs;
  reconnectBackoffMs = Math.min(reconnectBackoffMs * 2, RECONNECT_BACKOFF_MAX_MS);
  console.info(`RPC: scheduling reconnect in ${delay}ms`);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (!isRunning) {
      return;
    }
    createDealer();
    void loopDealerReceiving();
  }, delay);
};

const loopDealerReceiving = async (): Promise<void> => {
  try {
    dealer.connect(RPC_ZMQ_ADDRESS);
    console.log(`Connected to port ${RPC_BOUND_PORT}`);
    while (isRunning) {
      const reply = await dealer.receive();
      // successfully receiving means the link is healthy: reset the backoff
      reconnectBackoffMs = RECONNECT_BACKOFF_START_MS;
      handleReply(reply);
    }
  } catch (e) {
    if (isRunning) {
      console.error(
        `RPC: receive loop for ${RPC_ZMQ_ADDRESS} exited with an exception:`,
        e
      );
      // self-heal: recreate the socket and try again with backoff
      scheduleReconnect();
    }
  }
};

export const initialBelnetRpcDealer = async (): Promise<void> => {
  if (dealer) {
    throw new Error('RPC Channel is already init.');
  }
  isRunning = true;
  createDealer();
  // just trigger the loop, non blocking
  void loopDealerReceiving();
};
