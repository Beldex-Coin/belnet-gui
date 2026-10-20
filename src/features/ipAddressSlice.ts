import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export const DEFAULT_VPN_IP = '0.0.0.0';

const PUBLIC_IP_STORAGE_KEY = 'belnet-gui.lastPublicIp';

/**
 * The public IP can only be looked up while NOT connected: once the exit is
 * mapped every lookup returns the exit node's address. Keep the last one we
 * saw so it can still be shown when the GUI starts already connected.
 */
const readLastPublicIp = (): string | undefined => {
  try {
    return window.localStorage.getItem(PUBLIC_IP_STORAGE_KEY) || undefined;
  } catch (e) {
    return undefined;
  }
};

export const persistLastPublicIp = (ip: string): void => {
  try {
    window.localStorage.setItem(PUBLIC_IP_STORAGE_KEY, ip);
  } catch (e) {
    // storage unavailable: only this session keeps the value
  }
};

export interface IpAddressState {
  publicIp?: string;
  publicIpLoading: boolean;
  vpnIp: string;
  vpnIpLoading: boolean;
  /**
   * Country the VPN IP is located in, i.e. the exit node's country. This is
   * the only source of a location for a custom exit node that is not in the
   * published exit node list.
   */
  vpnCountry?: string;
}

const initialState: IpAddressState = {
  publicIp: readLastPublicIp(),
  publicIpLoading: false,
  vpnIp: DEFAULT_VPN_IP,
  vpnIpLoading: false,
  vpnCountry: undefined
};

export const ipAddressSlice = createSlice({
  name: 'ipAddress',
  initialState,
  reducers: {
    markPublicIpLoading(state, action: PayloadAction<boolean>) {
      state.publicIpLoading = action.payload;
      return state;
    },
    setPublicIp(state, action: PayloadAction<string>) {
      state.publicIp = action.payload;
      state.publicIpLoading = false;
      return state;
    },
    markVpnIpLoading(state, action: PayloadAction<boolean>) {
      state.vpnIpLoading = action.payload;
      if (action.payload) {
        // a new lookup means a new exit: the old country no longer applies
        state.vpnCountry = undefined;
      }
      return state;
    },
    setVpnIp(
      state,
      action: PayloadAction<{ ip: string; country?: string }>
    ) {
      state.vpnIp = action.payload.ip;
      state.vpnCountry = action.payload.country;
      state.vpnIpLoading = false;
      return state;
    },
    resetVpnIp(state) {
      state.vpnIp = DEFAULT_VPN_IP;
      state.vpnCountry = undefined;
      state.vpnIpLoading = false;
      return state;
    }
  }
});

export const {
  markPublicIpLoading,
  setPublicIp,
  markVpnIpLoading,
  setVpnIp,
  resetVpnIp
} = ipAddressSlice.actions;

export const selectIpAddress = (state: RootState): IpAddressState =>
  state.ipAddress;
