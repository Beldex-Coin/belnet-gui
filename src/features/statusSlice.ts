import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatusErrorType } from '../../sharedIpc';
import {
  MAX_NUMBER_POINT_HISTORY,
  SpeedHistoryDataType
} from '../app/components/SpeedChart';
import { RootState } from '../app/store';
import { defaultDaemonSummaryStatus } from '../ipc/ipcRenderer';

export interface SummaryStatusState {
  isRunning: boolean;
  uptime?: number;
  version?: string;
  numPeersConnected: number;
  uploadUsage: number;
  downloadUsage: number;
  beldexAddress: string;
  numPathsBuilt: number;
  numRoutersKnown: number;
  ratio: string;
  globalError: StatusErrorType;
  speedHistory: SpeedHistoryDataType;
}
const getDefaultSpeedHistory = (): SpeedHistoryDataType => {
  return {
    upload: new Array<number>(MAX_NUMBER_POINT_HISTORY).fill(0),
    download: new Array<number>(MAX_NUMBER_POINT_HISTORY).fill(0)
  };
};

const initialSummaryStatusState: SummaryStatusState = {
  ...defaultDaemonSummaryStatus,
  speedHistory: getDefaultSpeedHistory()
};

const removeFirstElementIfNeeded = (speedHistory: SpeedHistoryDataType) => {
  if (speedHistory.download.length > MAX_NUMBER_POINT_HISTORY) {
    speedHistory.download.shift();
    speedHistory.upload.shift();
  }
  return speedHistory;
};

export const statusSlice = createSlice({
  name: 'status',
  initialState: initialSummaryStatusState,
  reducers: {
    updateFromDaemonStatus: (
      state,
      action: PayloadAction<{
        daemonStatus?: Omit<SummaryStatusState, 'speedHistory'>;
        error?: string;
      }>
    ) => {
      state.isRunning = action.payload.daemonStatus?.isRunning || false;
      if (!state.isRunning || !action.payload.daemonStatus?.beldexAddress) {
        state.downloadUsage = 0;
        state.uploadUsage = 0;
        state.numPathsBuilt = 0;
        state.numRoutersKnown = 0;
        state.numPeersConnected = 0;
        state.beldexAddress = '';
        state.ratio = '';
        state.version = undefined;
        state.uptime = undefined;
        state.speedHistory = getDefaultSpeedHistory();
        return state;
      }

      if (state.globalError === 'error-start-stop') {
        state.globalError = undefined;
      }

      state.downloadUsage = action.payload.daemonStatus?.downloadUsage || 0;
      state.uploadUsage = action.payload.daemonStatus?.uploadUsage || 0;

      state.numPathsBuilt = action.payload.daemonStatus?.numPathsBuilt || 0;
      state.numRoutersKnown = action.payload.daemonStatus?.numRoutersKnown || 0;
      state.numPeersConnected =
        action.payload.daemonStatus?.numPeersConnected || 0;
      state.beldexAddress = action.payload.daemonStatus?.beldexAddress || '';
      state.ratio = action.payload.daemonStatus?.ratio || '';
      state.version = action.payload.daemonStatus?.version;
      state.uptime = action.payload.daemonStatus?.uptime;

      // upload/download usage are already bytes/second rates:
      // store one point per poll tick.
      state.speedHistory.download.push(state.downloadUsage);
      state.speedHistory.upload.push(state.uploadUsage);

      // Remove the first item is the size is too long
      state.speedHistory = removeFirstElementIfNeeded(state.speedHistory);
      return state;
    },
    markAsStopped: (state) => {
      return { ...initialSummaryStatusState, globalError: state.globalError };
    },
    setGlobalError: (state, action: PayloadAction<StatusErrorType>) => {
      state.globalError = action.payload;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateFromDaemonStatus, markAsStopped, setGlobalError } =
  statusSlice.actions;
export const selectStatus = (state: RootState): SummaryStatusState =>
  state.status;
export const selectBelnetRunning = createSelector(
  selectStatus,
  (status) => status.isRunning
);

export const selectVersion = createSelector(
  selectStatus,
  (status) => status.version || ''
);

export const selectUptime = createSelector(
  selectStatus,
  (status) => status.uptime || 0
);

export const selectBelnetAddress = createSelector(
  selectStatus,
  (status) => status.beldexAddress || ''
);

export const selectGlobalError = createSelector(
  selectStatus,
  (status): StatusErrorType => status.globalError || undefined
);

export const selectUploadRate = createSelector(selectStatus, (status) =>
  makeRate(status.speedHistory.upload[MAX_NUMBER_POINT_HISTORY - 1] || 0)
);

export const selectDownloadRate = createSelector(selectStatus, (status) =>
  makeRate(status.speedHistory.download[MAX_NUMBER_POINT_HISTORY - 1] || 0)
);

export function makeRate(originalValue: number, forceMBUnit = false): string {
  let unit_idx = 0;
  const units = ['b', 'Kb', 'Mb'];
  if (forceMBUnit) {
    return `${((originalValue / (1024 * 1024))*8).toFixed(1)} ${units[2]}/s`;
  }
  let value = (originalValue * 8);

  while (value > 1000 && unit_idx + 1 < units.length) {
    value /= 1000;
    unit_idx += 1;
  }
  const unitSpeed = ` ${units[unit_idx]}`;

  return value.toFixed(1) + unitSpeed;
}
