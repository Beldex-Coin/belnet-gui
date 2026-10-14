import { configureStore } from '@reduxjs/toolkit';
import { appLogsSlice } from '../features/appLogsSlice';
import { exitStatusSlice } from '../features/exitStatusSlice';
import { ipAddressSlice } from '../features/ipAddressSlice';
import { statusSlice } from '../features/statusSlice';
import { uiSlice } from '../features/uiStatusSlice';

export const store = configureStore({
  reducer: {
    status: statusSlice.reducer,
    exitStatus: exitStatusSlice.reducer,
    uiStatus: uiSlice.reducer,
    appLogsStatus: appLogsSlice.reducer,
    ipAddress: ipAddressSlice.reducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
