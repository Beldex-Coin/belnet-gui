import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface ExitStatusState {
  // set to true when the user clicked. We must block other call while this is true
  exitLoading: boolean;
  // false until the first get_status gets resolved/fails
  initialLoadingFinished: boolean;

  // Those are user entered values
  // When clicking on enable exit, those are the values used to setup the daemon
  // exitNodeFromUser is required, but not exitAuthCodeFromUser
  exitNodeFromUser?: string;
  exitAuthCodeFromUser?: string;

  // those 2 fields will be set once exitLoading is done loading with what the daemon gave us back.
  exitNodeFromDaemon?: string;
  exitAuthCodeFromDaemon?: string;

  // --- exit node swap (Change Node) ---
  // True for the whole unmap -> map sequence. While this is set the UI must
  // keep reporting "switching" rather than reading through to the daemon
  // state, because the daemon legitimately reports no exit in between.
  swapping: boolean;
  // node we were on before the swap, kept so we can roll back on failure
  swapFromNode?: string;
  swapTargetNode?: string;
  // last swap failure reason, cleared when the user acknowledges it
  swapError?: string;
  // set when a failed swap was successfully rolled back to the previous node
  swapRolledBack: boolean;

  /**
   * The BNS name the user picked, when it differs from the address the daemon
   * resolved it to. `exitNodeFromDaemon` always holds the resolved address;
   * this holds e.g. "andromeda.bdx" so the node list can still mark the row
   * the user actually chose as connected.
   */
  activeExitAlias?: string;
  /**
   * The resolved address `activeExitAlias` belongs to. The alias is only shown
   * while the daemon is still exiting through this exact address, so a stale
   * name can never be displayed for a different exit.
   */
  activeExitAliasAddress?: string;
}

const initialStatusState: ExitStatusState = {
  // default to true to let the user know we are fetching data on app load
  exitLoading: true,
  initialLoadingFinished: false,
  exitNodeFromUser: undefined,
  exitAuthCodeFromUser: undefined,
  exitNodeFromDaemon: undefined,
  exitAuthCodeFromDaemon: undefined,
  swapping: false,
  swapFromNode: undefined,
  swapTargetNode: undefined,
  swapError: undefined,
  swapRolledBack: false,
  activeExitAlias: undefined,
  activeExitAliasAddress: undefined
};

export const exitStatusSlice = createSlice({
  name: 'exitStatus',
  initialState: initialStatusState,
  reducers: {
    markExitIsTurningOn: (state) => {
      state.exitLoading = true;

      state.exitNodeFromDaemon = undefined;
      state.exitAuthCodeFromDaemon = undefined;
      return state;
    },
    markExitIsTurningOff: (state) => {
      state.exitLoading = true;
      return state;
    },
    markExitFailedToLoad: (state) => {
      state.exitLoading = false;
      state.exitNodeFromDaemon = undefined;
      state.exitAuthCodeFromDaemon = undefined;
      return state;
    },
    markInitialLoadingFinished(state) {
      if (!state.initialLoadingFinished) {
        state.exitLoading = false;
        state.initialLoadingFinished = true;
      }
      return state;
    },
    onUserExitNodeSet: (state, action: PayloadAction<string>) => {
      state.exitNodeFromUser = action.payload;
      return state;
    },
    onUserAuthCodeSet: (state, action: PayloadAction<string>) => {
      state.exitAuthCodeFromUser = action.payload;
      return state;
    },
    markExitNodesFromDaemon: (
      state,
      action: PayloadAction<{
        exitNodeFromDaemon?: string;
        exitAuthCodeFromDaemon?: string;
      }>
    ) => {
      state.exitLoading = false;
      state.exitNodeFromDaemon = action.payload.exitNodeFromDaemon;
      state.exitAuthCodeFromDaemon = action.payload.exitAuthCodeFromDaemon;
      return state;
    },

    /**
     * Swap (Change Node) lifecycle. markSwapStarted must be dispatched before
     * the unmap call so the UI never reads the momentary "no exit" daemon
     * state as a disconnect.
     */
    markSwapStarted: (
      state,
      action: PayloadAction<{ fromNode?: string; targetNode: string }>
    ) => {
      state.swapping = true;
      state.swapError = undefined;
      state.swapRolledBack = false;
      state.swapFromNode = action.payload.fromNode;
      state.swapTargetNode = action.payload.targetNode;
      return state;
    },
    markSwapSucceeded: (
      state,
      action: PayloadAction<{ exitNode: string; alias?: string }>
    ) => {
      state.swapping = false;
      state.swapError = undefined;
      state.swapRolledBack = false;
      state.swapFromNode = undefined;
      state.swapTargetNode = undefined;
      state.exitLoading = false;
      // Store the address the daemon actually mapped, not the string the user
      // picked: a BNS name like "andromeda.bdx" is resolved by the daemon and
      // never appears in exitMap, so keeping the name here would make every
      // later comparison against daemon state fail.
      state.exitNodeFromDaemon = action.payload.exitNode;
      state.activeExitAlias = action.payload.alias;
      state.activeExitAliasAddress = action.payload.alias
        ? action.payload.exitNode
        : undefined;
      return state;
    },
    markSwapFailed: (
      state,
      action: PayloadAction<{ error: string; rolledBackTo?: string }>
    ) => {
      state.swapping = false;
      state.swapError = action.payload.error;
      state.swapRolledBack = Boolean(action.payload.rolledBackTo);
      state.swapFromNode = undefined;
      state.swapTargetNode = undefined;
      state.exitLoading = false;
      state.exitNodeFromDaemon = action.payload.rolledBackTo;
      return state;
    },
    clearSwapError: (state) => {
      state.swapError = undefined;
      state.swapRolledBack = false;
      return state;
    },
    /**
     * Records the BNS name that produced the currently mapped exit address,
     * so the node list can mark the row the user picked and the Main tab can
     * show the name instead of the address. Cleared by passing undefined.
     */
    setActiveExitAlias: (
      state,
      action: PayloadAction<{ alias: string; address: string } | undefined>
    ) => {
      state.activeExitAlias = action.payload?.alias;
      state.activeExitAliasAddress = action.payload?.address;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  markExitIsTurningOn,
  markExitIsTurningOff,
  markExitFailedToLoad,
  markExitNodesFromDaemon,
  onUserExitNodeSet,
  onUserAuthCodeSet,
  markInitialLoadingFinished,
  markSwapStarted,
  markSwapSucceeded,
  markSwapFailed,
  clearSwapError,
  setActiveExitAlias
} = exitStatusSlice.actions;
export const selectExitStatus = (state: RootState): ExitStatusState =>
  state.exitStatus;

export const selectHasExitNodeEnabled = createSelector(
  selectExitStatus,
  (status) => Boolean(status.exitNodeFromDaemon)
);

export const selectHasExitNodeChangeLoading = createSelector(
  selectExitStatus,
  (status) => status.exitLoading
);

export const selectExitNodeFromUser = createSelector(
  selectExitStatus,
  (status) => status.exitNodeFromUser
);

export const selectAuthCodeFromUser = createSelector(
  selectExitStatus,
  (status) => status.exitAuthCodeFromUser
);

// --- swap selectors ---

export const selectIsSwappingExitNode = createSelector(
  selectExitStatus,
  (status) => status.swapping
);

export const selectSwapTargetNode = createSelector(
  selectExitStatus,
  (status) => status.swapTargetNode
);

export const selectSwapError = createSelector(
  selectExitStatus,
  (status) => status.swapError
);

export const selectSwapRolledBack = createSelector(
  selectExitStatus,
  (status) => status.swapRolledBack
);

/**
 * The node the daemon is currently exiting through. During a swap this stays
 * on the node we came from, so the Change Node list keeps marking the right
 * row as connected while the switch is in flight.
 */
export const selectActiveExitNode = createSelector(
  selectExitStatus,
  (status) => (status.swapping ? status.swapFromNode : status.exitNodeFromDaemon)
);

/**
 * The BNS name behind the active exit address, when there is one. The node
 * list matches a row against either this or the resolved address.
 */
export const selectActiveExitAlias = createSelector(
  selectExitStatus,
  (status) =>
    !status.swapping &&
    status.activeExitAlias &&
    status.activeExitAliasAddress === status.exitNodeFromDaemon
      ? status.activeExitAlias
      : undefined
);

/**
 * What to show as the connected exit node: the BNS name the user picked when
 * there is one, otherwise the address the daemon reports.
 */
export const selectExitNodeDisplayName = createSelector(
  selectExitStatus,
  selectActiveExitAlias,
  (status, alias) => alias || status.exitNodeFromDaemon
);
