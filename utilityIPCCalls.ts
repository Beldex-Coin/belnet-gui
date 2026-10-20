/* eslint-disable @typescript-eslint/no-explicit-any */
import net from 'net';
import dns from 'dns';
import https from 'https';
import { takeEventByJobId } from './ipcNode';
import * as belnetProcessManager from './belnetProcessManager';
import { getMainWindow, getTrayIcon } from './main';
import { IPC_CHANNEL_KEY } from './sharedIpc';

let isRendererReady = false;

const PROBE_TIMEOUT_MS = 2000;
const PROBE_CONCURRENCY = 5;
const PROBE_PORTS = [443, 80];
// reply must beat the renderer IPC timeout (10s) and the main-process job TTL
// sweep (15s), so cap the whole probe run and return partial results.
const PROBE_GLOBAL_DEADLINE_MS = 8000;

/**
 * Measures the TCP connect time (ms) to a single host.
 * Resolves to null when the host cannot be resolved or reached within the
 * timeout: exit nodes addressed inside the belnet network are not directly
 * reachable from the host machine, and must simply be reported as unmeasured.
 */
const probeOneHost = async (host: string): Promise<number | null> => {
  // fail fast for in-network / unresolvable names
  const resolved = await new Promise<boolean>((resolve) => {
    dns.lookup(host, (err) => resolve(!err));
  });
  if (!resolved) {
    return null;
  }

  for (const port of PROBE_PORTS) {
    const latency = await new Promise<number | null>((resolve) => {
      const started = Date.now();
      const socket = new net.Socket();
      const finish = (value: number | null) => {
        socket.removeAllListeners();
        socket.destroy();
        resolve(value);
      };
      socket.setTimeout(PROBE_TIMEOUT_MS);
      socket.once('connect', () => finish(Date.now() - started));
      socket.once('timeout', () => finish(null));
      socket.once('error', () => finish(null));
      socket.connect(port, host);
    });
    if (latency !== null) {
      return latency;
    }
  }
  return null;
};

/**
 * IPC: probes a list of exit node hostnames with limited concurrency and
 * replies with a JSON object mapping hostname -> latency ms (or null).
 */
export async function probeExitNodeLatencies(
  jobId: string,
  hostsJson: string
): Promise<void> {
  const results: Record<string, number | null> = {};
  try {
    const hosts: Array<string> = JSON.parse(hostsJson);
    const queue = [...hosts];

    const worker = async () => {
      while (queue.length > 0) {
        const host = queue.shift();
        if (!host) {
          return;
        }
        results[host] = await probeOneHost(host);
      }
    };
    await Promise.race([
      Promise.all(
        new Array(Math.min(PROBE_CONCURRENCY, hosts.length))
          .fill(null)
          .map(worker)
      ),
      new Promise((resolve) => setTimeout(resolve, PROBE_GLOBAL_DEADLINE_MS))
    ]);
  } catch (e) {
    console.info('probeExitNodeLatencies failed with', e);
  }
  const event = takeEventByJobId(jobId);
  event?.sender.send(
    `${IPC_CHANNEL_KEY}-done`,
    jobId,
    null,
    JSON.stringify(results)
  );
}

// --- public / VPN IP address lookup ---
//
// Done here in the main process (Node https) rather than with fetch() in the
// renderer: no CORS for the file:// origin, and `agent: false` forces a fresh
// TCP connection per lookup. A pooled keep-alive connection opened before the
// tunnel came up would otherwise keep reporting the pre-VPN address.

type IpLookup = { ip?: string; country?: string; countryCode?: string };

type IpProvider = {
  url: string;
  // returns the ip (and country, when the provider knows it) from the
  // provider's JSON, or undefined if it reported an error
  parse: (json: any) => IpLookup | undefined;
};

const asText = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

const IP_PROVIDERS: Array<IpProvider> = [
  {
    url: 'https://ipwho.is/',
    parse: (json) =>
      json && json.success !== false
        ? {
            ip: asText(json.ip),
            country: asText(json.country),
            countryCode: asText(json.country_code)
          }
        : undefined
  },
  {
    url: 'https://ipapi.co/json/',
    parse: (json) =>
      json && !json.error
        ? {
            ip: asText(json.ip),
            country: asText(json.country_name),
            countryCode: asText(json.country_code || json.country)
          }
        : undefined
  }
];

const IP_LOOKUP_TIMEOUT_MS = 5000;
const IP_LOOKUP_MAX_BODY_BYTES = 64 * 1024;

const getJson = (url: string, timeoutMs: number): Promise<any> =>
  new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        agent: false,
        timeout: timeoutMs,
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          // ipapi.co rejects requests without a user agent
          'User-Agent': 'belnet-gui'
        }
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk: string) => {
          body += chunk;
          if (body.length > IP_LOOKUP_MAX_BODY_BYTES) {
            req.destroy(new Error('response too large'));
          }
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
        res.on('error', reject);
      }
    );
    req.on('timeout', () => req.destroy(new Error('timed out')));
    req.on('error', reject);
  });

/**
 * IPC: looks up the address this machine currently appears from on the
 * internet. Before connecting that is the public IP; once the exit is mapped
 * all traffic leaves through the exit node, so the same lookup returns the
 * VPN IP -- and the country it reports is the exit node's country, which is
 * how a custom exit node (one not in the published list) gets a location.
 * Tries each provider in turn.
 * Replies with JSON `{ ip, country?, countryCode?, provider }` or `{ error }`.
 */
export async function fetchIpAddress(jobId: string): Promise<void> {
  let reply: Record<string, string> = { error: 'no provider answered' };
  for (const provider of IP_PROVIDERS) {
    try {
      const found = provider.parse(
        await getJson(provider.url, IP_LOOKUP_TIMEOUT_MS)
      );
      if (found?.ip && net.isIP(found.ip)) {
        reply = { ip: found.ip, provider: provider.url };
        if (found.country) {
          reply.country = found.country;
        }
        if (found.countryCode) {
          reply.countryCode = found.countryCode;
        }
        break;
      }
      reply = { error: `${provider.url} returned no ip` };
    } catch (e: any) {
      console.info(`fetchIpAddress: ${provider.url} failed:`, e?.message || e);
      reply = { error: `${provider.url}: ${e?.message || e}` };
    }
  }
  const event = takeEventByJobId(jobId);
  event?.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, JSON.stringify(reply));
}

export function markRendererReady(jobId: string): void {
  isRendererReady = true;

  void belnetProcessManager.doStartBelnetProcess(jobId);
}

export function minimizeToTray(jobId: string, type: string): void {
  const mainWindow = getMainWindow();
  const tray = getTrayIcon();
  if (mainWindow?.isVisible() && type === 'minimize') {
    mainWindow.minimize();
  } else if(type === 'close') {
    if (tray) {
      (tray as any).closeApp();
    }
  }

  if (tray) {
    (tray as any).updateContextMenu();
  }
  const event = takeEventByJobId(jobId);
  event?.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, '');
}

export const getRendererReady = (): boolean => isRendererReady;
