import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export type TabIndex = 0 | 1 | 2;

export type ThemeType = 'light' | 'dark';

export type GeneralInfosState = {
  tabSelected: 0 | 1 | 2;
  theme: ThemeType;
  // full-screen Change Node overlay
  changeNodeScreenOpen: boolean;
  // full-screen Settings overlay (theme, auto-connect, about)
  settingsScreenOpen: boolean;
  // About BelNet bottom sheet
  aboutOpen: boolean;
  /**
   * Connect to the nearest fast exit node when the app starts.
   * Off by default; persisted across restarts.
   */
  autoConnect: boolean;
};

const AUTO_CONNECT_STORAGE_KEY = 'belnet-gui.autoConnect';

const readAutoConnect = (): boolean => {
  try {
    return window.localStorage.getItem(AUTO_CONNECT_STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

export const persistAutoConnect = (enabled: boolean): void => {
  try {
    window.localStorage.setItem(AUTO_CONNECT_STORAGE_KEY, String(enabled));
  } catch (e) {
    // storage unavailable: the setting only lasts this session
  }
};

const initialGeneralInfosState: GeneralInfosState = {
  tabSelected: 0,
  theme: 'dark',
  changeNodeScreenOpen: false,
  settingsScreenOpen: false,
  aboutOpen: false,
  autoConnect: readAutoConnect()
};
export const uiSlice = createSlice({
  name: 'ui',
  initialState: initialGeneralInfosState,
  reducers: {
    setTabSelected(state, action: PayloadAction<'main' | 'chart' | 'logs'>) {
      const tabSelected =
        action.payload === 'main' ? 0 : action.payload === 'chart' ? 1 : 2;
      return {
        ...state,
        tabSelected
      };
    },
    setTheme(state, action: PayloadAction<ThemeType>) {
      return {
        ...state,
        theme: action.payload
      };
    },
    openChangeNodeScreen(state) {
      return { ...state, changeNodeScreenOpen: true };
    },
    closeChangeNodeScreen(state) {
      return { ...state, changeNodeScreenOpen: false };
    },
    openSettingsScreen(state) {
      return { ...state, settingsScreenOpen: true };
    },
    closeSettingsScreen(state) {
      return { ...state, settingsScreenOpen: false, aboutOpen: false };
    },
    openAbout(state) {
      return { ...state, aboutOpen: true };
    },
    closeAbout(state) {
      return { ...state, aboutOpen: false };
    },
    setAutoConnect(state, action: PayloadAction<boolean>) {
      // persisted by the caller (persistAutoConnect): reducers stay pure
      return { ...state, autoConnect: action.payload };
    }
  }
});

export const {
  setTabSelected,
  setTheme,
  openChangeNodeScreen,
  closeChangeNodeScreen,
  openSettingsScreen,
  closeSettingsScreen,
  openAbout,
  closeAbout,
  setAutoConnect
} = uiSlice.actions;
export const selectUiState = (state: RootState): GeneralInfosState =>
  state.uiStatus;

export const selectChangeNodeScreenOpen = (state: RootState): boolean =>
  state.uiStatus.changeNodeScreenOpen;

export const selectSelectedTab = (state: RootState): TabIndex =>
  state.uiStatus.tabSelected;

export const selectedTheme = (state: RootState): ThemeType =>
  state.uiStatus.theme;

export const selectSettingsScreenOpen = (state: RootState): boolean =>
  state.uiStatus.settingsScreenOpen;

export const selectAboutOpen = (state: RootState): boolean =>
  state.uiStatus.aboutOpen;

export const selectAutoConnect = (state: RootState): boolean =>
  state.uiStatus.autoConnect;
