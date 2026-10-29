/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReactDom from 'react-dom';
import 'focus-visible/dist/focus-visible';
import { useInterval } from '@chakra-ui/react';

import {
  getSummaryStatus,
  initializeIpcRendererSide,
  parseSummaryStatus,
  POLLING_STATUS_INTERVAL_MS
} from '../ipc/ipcRenderer';
import {
  markAsStopped,
  setGlobalError,
  updateFromDaemonStatus
} from '../features/statusSlice';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks';
import {
  markExitNodesFromDaemon,
  markInitialLoadingFinished,
  setActiveExitAlias
} from '../features/exitStatusSlice';
import {
  isBnsName,
  lookupExitAlias,
  rememberExitAlias
} from '../features/exitAliases';
import { AppLayout } from './components/AppLayout';
import { appendToApplogs } from '../features/appLogsSlice';
import { GlobalStyle } from './globalStyles';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';
import { selectedTheme } from '../features/uiStatusSlice';
import { StatusErrorType } from '../../sharedIpc';
import { useGlobalConnectingStatus } from './hooks/connectingStatus';
import { useIpAddressTracking } from './hooks/ipAddressTracking';
import { useAutoConnect } from './hooks/autoConnect';

void initializeIpcRendererSide();

export function appendToAppLogsOutsideRedux(logline: string): void {
  store.dispatch(appendToApplogs(logline));
}

export function setErrorOutsideRedux(errorStatus: StatusErrorType): void {
  store.dispatch(setGlobalError(errorStatus));
}

// number of consecutive failed polls before we consider the daemon stopped.
// A single slow/timed-out reply must not flip the UI to "disconnected".
const MAX_CONSECUTIVE_POLL_FAILURES = 3;

/**
 * The daemon only reports the resolved address of a BNS exit. When a new exit
 * shows up, work out which BNS name it came from so the UI can show the name:
 *  - the name the user is connecting with right now (covers an addExit reply
 *    that timed out but the mapping still went through), or
 *  - the name we saw resolve to this address before (GUI restarted while the
 *    daemon kept the exit mapped).
 */
const restoreExitAlias = (exitAddress: string) => {
  const exitState = store.getState().exitStatus;
  if (exitState.swapping) {
    // the swap flow records its own alias when it settles
    return;
  }
  if (
    exitState.activeExitAlias &&
    exitState.activeExitAliasAddress === exitAddress
  ) {
    return;
  }
  const userIsConnecting =
    exitState.initialLoadingFinished && exitState.exitLoading;
  const requested = exitState.exitNodeFromUser;
  const alias =
    userIsConnecting && isBnsName(requested) && requested !== exitAddress
      ? requested
      : lookupExitAlias(exitAddress);

  if (alias) {
    store.dispatch(setActiveExitAlias({ alias, address: exitAddress }));
    rememberExitAlias(exitAddress, alias);
  }
};

const useSummaryStatusPolling = () => {
  // dispatch is used to make updates to the redux store
  const dispatch = useAppDispatch();

  const globalStatus = useGlobalConnectingStatus();
  const isPollInFlight = React.useRef(false);
  const consecutiveFailures = React.useRef(0);

  // register an interval for fetching the status of the daemon
  useInterval(async () => {
    // getSummaryStatus sends an IPC call to our node environment
    // once on the node environment, it will trigger and wait for the RPC call to finish
    // or timeout before returning.

    // skip this tick if the previous poll is still awaiting its reply,
    // otherwise slow replies pile up concurrent jobs.
    if (isPollInFlight.current) {
      return;
    }
    isPollInFlight.current = true;
    try {
      const statusAsString = await getSummaryStatus();
      // The status we get is a plain string. Extract the details we care from it and build
      // the state we will send as update to the redux store
      const parsedStatus = parseSummaryStatus(statusAsString);
      // Send the update to the redux store.
      dispatch(updateFromDaemonStatus({ daemonStatus: parsedStatus }));
      const hasExitNodeChange =
        store.getState().exitStatus.exitNodeFromDaemon !==
        parsedStatus.exitNode;
      const hasExitAuthChange =
        store.getState().exitStatus.exitAuthCodeFromDaemon !==
        parsedStatus.exitAuthCode;
      if (hasExitNodeChange) {
        dispatch(
          appendToApplogs(
            `exitNode set by daemon: ${parsedStatus.exitNode || ''}`
          )
        );
      }

      if (hasExitAuthChange) {
        dispatch(
          appendToApplogs(
            `authCode set by daemon: ${parsedStatus.exitAuthCode || ''}`
          )
        );
      }

      if (hasExitNodeChange && parsedStatus.exitNode) {
        restoreExitAlias(parsedStatus.exitNode);
      }

      if (hasExitNodeChange || hasExitAuthChange) {
        dispatch(
          markExitNodesFromDaemon({
            exitNodeFromDaemon: parsedStatus.exitNode,
            exitAuthCodeFromDaemon: parsedStatus.exitAuthCode
          })
        );
        // the daermon told us we have an exit set but our current state says we have an error on the status.
        // make sure to remove that error from the UI
        if (
          hasExitNodeChange &&
          parsedStatus.exitNode &&
          globalStatus === 'error-add-exit'
        ) {
          dispatch(setGlobalError(undefined));
        }
      }
      dispatch(markInitialLoadingFinished());
      consecutiveFailures.current = 0;
    } catch (e) {
      consecutiveFailures.current += 1;

      if (consecutiveFailures.current === 1) {
        // keep the last-known state on transient failures, just log it
        dispatch(
          appendToApplogs('status poll failed once, retrying before marking stopped')
        );
      }

      if (consecutiveFailures.current >= MAX_CONSECUTIVE_POLL_FAILURES) {
        dispatch(markAsStopped());
        dispatch(
          markExitNodesFromDaemon({
            exitNodeFromDaemon: undefined,
            exitAuthCodeFromDaemon: undefined
          })
        );
      }
      dispatch(markInitialLoadingFinished());
    } finally {
      isPollInFlight.current = false;
    }
  }, POLLING_STATUS_INTERVAL_MS);
};

const App = () => {
  useSummaryStatusPolling();
  useIpAddressTracking();
  useAutoConnect();
  return <AppLayout />;
};

const BelnetThemeProvider = (props: { children: React.ReactNode }) => {
  const currentTheme = useSelector(selectedTheme);
  return (
    <ThemeProvider theme={currentTheme === 'light' ? lightTheme : darkTheme}>
      {props.children}
    </ThemeProvider>
  );
};

// Make the Redux store available to all sub components of <App/>
ReactDom.render(
  <Provider store={store}>
    <BelnetThemeProvider>
      <GlobalStyle />

      <App />
    </BelnetThemeProvider>
  </Provider>,
  document.getElementById('root')
);
