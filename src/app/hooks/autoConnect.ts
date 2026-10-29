import React from 'react';
import { useSelector } from 'react-redux';
import { appendToApplogs } from '../../features/appLogsSlice';
import { selectExitStatus } from '../../features/exitStatusSlice';
import { selectStatus } from '../../features/statusSlice';
import { selectAutoConnect } from '../../features/uiStatusSlice';
import { turnExitOn } from '../components/PowerButton/PowerButtonActions';
import { useAppDispatch } from '../hooks';
import { store } from '../store';

/**
 * When a node had to be picked without the device location (it is looked up a
 * moment after launch), wait this long for the nearest-node pick before
 * connecting to the fallback.
 */
const WAIT_FOR_NEAREST_MS = 8000;

/**
 * Auto-connect: when enabled in Settings, connect once per launch to the
 * exit node the Main tab picked -- the nearest fast node (speedScore > 0) --
 * as soon as the daemon is running and nothing is connected yet.
 *
 * It never acts when the daemon already has an exit (the GUI was restarted
 * while connected) or when the user connects / is connecting themselves.
 * A node the user picked by hand before it fires is respected.
 */
export const useAutoConnect = (): void => {
  const dispatch = useAppDispatch();
  // Only a setting that was already on when the app launched counts:
  // switching it on later takes effect on the next launch, and switching it
  // off before it fires cancels it.
  const enabledAtLaunch = React.useRef(store.getState().uiStatus.autoConnect);
  const enabled = useSelector(selectAutoConnect) && enabledAtLaunch.current;
  const exit = useSelector(selectExitStatus);
  const { isRunning, globalError } = useSelector(selectStatus);

  const done = React.useRef(false);
  const readySince = React.useRef<number | null>(null);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (done.current || !enabled || !exit.initialLoadingFinished) {
      return;
    }
    // already connected (or connecting) when we got here: nothing to do
    if (exit.exitNodeFromDaemon || exit.exitLoading || exit.swapping) {
      done.current = true;
      return;
    }
    if (!isRunning || globalError) {
      // daemon not up yet: wait for a later status poll
      return;
    }
    const node = exit.exitNodeFromUser || exit.autoSelection?.node;
    if (!node) {
      return; // exit node list not loaded yet
    }

    const now = Date.now();
    if (readySince.current === null) {
      readySince.current = now;
    }
    const pickedByDistance =
      exit.autoSelection?.basis === 'nearest' ||
      // the user picked one themselves
      (exit.exitNodeFromUser !== undefined &&
        exit.exitNodeFromUser !== exit.autoSelection?.node);
    const waited = now - readySince.current;
    if (!pickedByDistance && waited < WAIT_FOR_NEAREST_MS) {
      const timer = setTimeout(
        () => setTick((t) => t + 1),
        WAIT_FOR_NEAREST_MS - waited
      );
      return () => clearTimeout(timer);
    }

    done.current = true;
    dispatch(
      appendToApplogs(
        `Auto-connect: connecting to ${node}${
          exit.autoSelection?.node === node
            ? exit.autoSelection.basis === 'nearest'
              ? ' (nearest fast exit node)'
              : ' (device location unknown)'
            : ''
        }`
      )
    );
    void turnExitOn(dispatch, node, exit.exitAuthCodeFromUser);
  }, [
    enabled,
    tick,
    isRunning,
    globalError,
    exit.initialLoadingFinished,
    exit.exitNodeFromDaemon,
    exit.exitLoading,
    exit.swapping,
    exit.exitNodeFromUser,
    exit.exitAuthCodeFromUser,
    exit.autoSelection,
    dispatch
  ]);
};
