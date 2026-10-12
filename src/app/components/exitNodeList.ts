/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Shared exit node list: fetching, caching and latency probing.
 *
 * Extracted from ExitPanel so the Main tab panel and the Change Node screen
 * read the same cache instead of each running their own fetch + probe run.
 */
import { probeExitNodeLatencies } from '../../ipc/ipcRenderer';

export const EXIT_NODE_LIST_URL =
  'https://belnet-exitnode.s3.ap-south-1.amazonaws.com/exitnode-bns-list/exitnode_info_list.json';

const EXIT_LIST_FETCH_TIMEOUT_MS = 5000;
const EXIT_LIST_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export type ExitNode = {
  id?: number;
  name: string;
  country?: string;
  icon?: string;
  isActive?: string;
};

export type ExitNodeGroup = {
  type: string;
  node: Array<ExitNode>;
};

// module-level cache so switching tabs / opening the change node screen does
// not refetch and reprobe every time.
let cachedMenuList: Array<ExitNodeGroup> | null = null;
let cachedLatencies: Record<string, number | null> = {};
let cacheTimestamp = 0;

export const isCacheFresh = (): boolean =>
  Boolean(cachedMenuList) && Date.now() - cacheTimestamp < EXIT_LIST_CACHE_TTL_MS;

export const getCachedList = (): Array<ExitNodeGroup> | null => cachedMenuList;
export const getCachedLatencies = (): Record<string, number | null> =>
  cachedLatencies;

/** Drops the cached list so the next load refetches. */
export const invalidateExitNodeCache = (): void => {
  cachedMenuList = null;
  cachedLatencies = {};
  cacheTimestamp = 0;
};

const fetchWithTimeout = async (url: string, timeoutMs: number) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Fetches the exit node list with a timeout and a single retry.
 * Always settles, so callers can show an error state instead of hanging.
 */
export const fetchExitNodeList = async (): Promise<Array<ExitNodeGroup>> => {
  try {
    return await fetchWithTimeout(
      EXIT_NODE_LIST_URL,
      EXIT_LIST_FETCH_TIMEOUT_MS
    );
  } catch (e) {
    console.info('exit node list fetch failed, retrying once', e);
    return await fetchWithTimeout(
      EXIT_NODE_LIST_URL,
      EXIT_LIST_FETCH_TIMEOUT_MS
    );
  }
};

export const flattenNodes = (list: Array<ExitNodeGroup>): Array<ExitNode> => {
  const allNodes: Array<ExitNode> = [];
  list?.forEach((item) => {
    if (Array.isArray(item?.node)) {
      allNodes.push(...item.node);
    }
  });
  return allNodes;
};

export const latencyColor = (ms: number): string => {
  if (ms < 100) {
    return '#2ecc71';
  }
  if (ms < 250) {
    return '#f1c40f';
  }
  return '#e74c3c';
};

export const sortNodesByLatency = (
  nodes: Array<ExitNode>,
  latencies: Record<string, number | null>
): Array<ExitNode> => {
  return [...nodes].sort((a, b) => {
    const la = latencies[a?.name];
    const lb = latencies[b?.name];
    if (la == null && lb == null) {
      return 0;
    }
    if (la == null) {
      return 1;
    }
    if (lb == null) {
      return -1;
    }
    return la - lb;
  });
};

export type LoadedExitNodes = {
  list: Array<ExitNodeGroup>;
  latencies: Record<string, number | null>;
  fromCache: boolean;
};

/**
 * Returns the exit node list plus whatever latency measurements we have.
 * Serves the module cache when fresh; otherwise fetches, then probes.
 * Throws only when the list itself could not be fetched — a failed probe run
 * just yields an empty latency map.
 */
export const loadExitNodes = async (): Promise<LoadedExitNodes> => {
  if (isCacheFresh() && cachedMenuList) {
    return { list: cachedMenuList, latencies: cachedLatencies, fromCache: true };
  }

  const list = await fetchExitNodeList();
  cachedMenuList = list;
  cacheTimestamp = Date.now();

  const hosts = flattenNodes(list)
    .map((n) => n?.name)
    .filter(Boolean);

  if (hosts.length > 0) {
    try {
      cachedLatencies = await probeExitNodeLatencies(hosts);
    } catch (e) {
      console.info('exit node latency probe failed', e);
      cachedLatencies = {};
    }
  }

  return { list, latencies: cachedLatencies, fromCache: false };
};
