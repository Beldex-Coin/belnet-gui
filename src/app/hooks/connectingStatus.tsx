import { useSelector } from 'react-redux';
import { StatusErrorTypeSet } from '../../../sharedIpc';
import {
  selectHasExitNodeEnabled,
  selectHasExitNodeChangeLoading,
  selectIsSwappingExitNode
} from '../../features/exitStatusSlice';
import { selectGlobalError } from '../../features/statusSlice';

export type ConnectingStatus =
  | 'default'
  | 'connected'
  | 'connecting'
  | 'switching'
  | StatusErrorTypeSet;

export const useGlobalConnectingStatus = (): ConnectingStatus => {
  const exitIsSet = useSelector(selectHasExitNodeEnabled);
  const exitIsLoading = useSelector(selectHasExitNodeChangeLoading);
  const isSwapping = useSelector(selectIsSwappingExitNode);
  const globalError = useSelector(selectGlobalError);

  // Checked first and ahead of globalError: mid-swap the daemon legitimately
  // reports no exit for a moment, and the status poll would otherwise render
  // that as "Disconnected" and flash the UI.
  if (isSwapping) {
    return 'switching';
  }

  if (globalError) {
    return globalError;
  }

  if (exitIsLoading) {
    return 'connecting';
  }

  if (exitIsSet) {
    return 'connected';
  }
  return 'default';
};

export const isGlobalStatusError = (
  globalStatus: ConnectingStatus
): boolean => {
  return globalStatus.startsWith('error-');
};
