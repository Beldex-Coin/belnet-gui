import React from 'react';
import { useSelector } from 'react-redux';
import { fetchIpAddress } from '../../ipc/ipcRenderer';
import { appendToApplogs } from '../../features/appLogsSlice';
import { selectExitStatus } from '../../features/exitStatusSlice';
import {
  markPublicIpLoading,
  markVpnIpLoading,
  persistLastPublicIp,
  resetVpnIp,
  setPublicIp,
  setVpnIp
} from '../../features/ipAddressSlice';
import { useAppDispatch } from '../hooks';
import { store } from '../store';
import { useGlobalConnectingStatus } from './connectingStatus';

// Routes are poked up/down asynchronously by the daemon after the exit is
// (un)mapped, so give them a moment before asking "what is my IP".
const SETTLE_AFTER_CONNECT_MS = 2000;
const SETTLE_AFTER_DISCONNECT_MS = 1500;

// Right after connecting, a lookup can still leave through the old route and
// come back with the public IP. Retry until the address differs.
const VPN_IP_MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 3000;
const PUBLIC_IP_MAX_ATTEMPTS = 2;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Phase = 'connected' | 'disconnected' | 'transition';

/**
 * Keeps the public / VPN IP shown on the Chart tab up to date:
 *  - not connected: VPN IP is 0.0.0.0 and the public IP is (re)fetched
 *  - connected:     the VPN IP is fetched (it is the exit node's address),
 *                   and refetched whenever the exit node changes
 *  - connecting / switching: nothing is fetched until it settles
 *
 * Mounted once at the app root so it runs whatever tab is visible.
 */
export const useIpAddressTracking = (): void => {
  const dispatch = useAppDispatch();
  const status = useGlobalConnectingStatus();
  const exitNode = useSelector(selectExitStatus).exitNodeFromDaemon;

  const phase: Phase =
    status === 'connected'
      ? 'connected'
      : status === 'connecting' || status === 'switching'
      ? 'transition'
      : 'disconnected';
  const phaseKey = phase === 'connected' ? `connected:${exitNode}` : phase;

  // each run gets a generation; results of a superseded run are dropped
  const generation = React.useRef(0);

  React.useEffect(() => {
    const myGeneration = ++generation.current;
    const isCurrent = () => generation.current === myGeneration;

    if (phase === 'transition') {
      return;
    }

    if (phase === 'disconnected') {
      dispatch(resetVpnIp());
      dispatch(markPublicIpLoading(true));
      void (async () => {
        await sleep(SETTLE_AFTER_DISCONNECT_MS);
        for (let attempt = 1; attempt <= PUBLIC_IP_MAX_ATTEMPTS; attempt++) {
          if (!isCurrent()) {
            return;
          }
          try {
            const ip = await fetchIpAddress();
            if (!isCurrent()) {
              return;
            }
            dispatch(setPublicIp(ip));
            persistLastPublicIp(ip);
            return;
          } catch (e: any) {
            if (attempt === PUBLIC_IP_MAX_ATTEMPTS && isCurrent()) {
              dispatch(markPublicIpLoading(false));
              dispatch(
                appendToApplogs(`Public IP lookup failed: ${e?.message || e}`)
              );
              return;
            }
            await sleep(RETRY_DELAY_MS);
          }
        }
      })();
      return;
    }

    // connected
    dispatch(markVpnIpLoading(true));
    void (async () => {
      await sleep(SETTLE_AFTER_CONNECT_MS);
      let lastError = '';
      for (let attempt = 1; attempt <= VPN_IP_MAX_ATTEMPTS; attempt++) {
        if (!isCurrent()) {
          return;
        }
        try {
          const ip = await fetchIpAddress();
          if (!isCurrent()) {
            return;
          }
          const publicIp = store.getState().ipAddress.publicIp;
          // still leaving through the old route: wait for the tunnel
          if (ip !== publicIp || attempt === VPN_IP_MAX_ATTEMPTS) {
            dispatch(setVpnIp(ip));
            if (ip === publicIp) {
              dispatch(
                appendToApplogs(
                  `VPN IP lookup still returns the public IP (${ip})`
                )
              );
            }
            return;
          }
        } catch (e: any) {
          lastError = e?.message || String(e);
        }
        await sleep(RETRY_DELAY_MS);
      }
      if (isCurrent()) {
        dispatch(markVpnIpLoading(false));
        dispatch(appendToApplogs(`VPN IP lookup failed: ${lastError}`));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseKey]);
};
