/* eslint-disable @typescript-eslint/no-explicit-any */
import Electron, { BrowserWindow } from 'electron';
import { initialBelnetRpcDealer } from './belnetRpcCall';
import {
  IPC_CHANNEL_KEY,
  IPC_GLOBAL_ERROR,
  IPC_LOG_LINE,
  StatusErrorType
} from './sharedIpc';
const { ipcMain } = Electron;

import * as rpcCalls from './belnetRpcCall';
import * as belnetProcessManager from './belnetProcessManager';
import * as utilityIPCCalls from './utilityIPCCalls';

export const eventsByJobId = Object.create(null);

export const getEventByJobId = (jobId: string): any => {
  const event = eventsByJobId[jobId];

  if (!event) {
    throw new Error(`Could not find the event for jobId ${jobId}`);
  }
  return event;
};

let getMainWindowLocal: () => BrowserWindow | null;

/**
 * Returns the function to call for that RPC call, so with zeromq client, or undefined.
 */
function isRpcCall(fnName: string) {
  return (rpcCalls as any)[fnName];
}

/**
 * Returns the function to call for that Belnet Process Manager call, or undefined.
 */
function isBelnetProcessManagerCall(fnName: string) {
  return (belnetProcessManager as any)[fnName];
}

/**
 * Returns the function to call for that Utility IPC call.
 */
function isUtilityCall(fnName: string) {
  return (utilityIPCCalls as any)[fnName];
}

export async function initializeIpcNodeSide(
  getMainWindow: () => BrowserWindow | null
): Promise<void> {
  await initialBelnetRpcDealer();
  getMainWindowLocal = getMainWindow;

  ipcMain.on(IPC_CHANNEL_KEY, async (event, jobId, callName, ...args) => {
    try {
      // Try to find a matching rpc call, or a matching belnetProcessManager call or a matching utility call
      const rpcCall = isRpcCall(callName);
      const belnetProcessManagerCall = isBelnetProcessManagerCall(callName);
      const utilityCall = isUtilityCall(callName);

      const fnToCall = rpcCall || belnetProcessManagerCall || utilityCall;
      if (!fnToCall) {
        // if that fn is not defined at all, there is not much we can do.
        throw new Error(
          `ipc channel: ${callName} is not an available function`
        );
      }
      if (eventsByJobId[jobId]) {
        throw new Error(`There is already a event for this jobId ${jobId}`);
      }
      eventsByJobId[jobId] = event;
      // this call just trigger the RPC call. The reply will come from somewhere else
      await fnToCall(jobId, ...args);
    } catch (error: any) {
      const errorForDisplay = error && error.msg ? error.msg : error;
      console.log(
        `ipc channel error with call ${callName}: ${errorForDisplay}`
      );
      delete eventsByJobId[jobId];
      event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, error?.msg || null);
    }
  });
}

export function logLineToAppSide(logLine: string): void {
  const withTimestamp = `${logLine}`;
  if (utilityIPCCalls.getRendererReady()) {
    console.info(`logLine ready "${logLine}`);
    getMainWindowLocal()?.webContents.send(IPC_LOG_LINE, withTimestamp);
  } else {
    console.info('logLineToAppSide : renderer is not ready');
  }
}

export function sendGlobalErrorToAppSide(globalError: StatusErrorType): void {
  if (utilityIPCCalls.getRendererReady()) {
    console.info(`global error "${globalError}`);
    getMainWindowLocal()?.webContents.send(IPC_GLOBAL_ERROR, globalError);
  } else {
    console.info('sendGlobalErrorToAppSide : renderer is not ready');
  }
}
