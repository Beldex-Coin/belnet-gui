import { sendIpcReplyAndDeleteJob } from './ipcNode';
import { subscribeBelnetLogs } from './belnetRpcCall';

import { getMainWindow, getTrayIcon } from './main';


let isRendererReady = false;

export function markRendererReady(jobId: string): void {
  isRendererReady = true;

  sendIpcReplyAndDeleteJob(jobId, null, '');
  subscribeBelnetLogs();
}

export function minimizeToTray(jobId: string, type: string): void {
  const mainWindow = getMainWindow();
  const tray = getTrayIcon();
  if (mainWindow?.isVisible() && type === 'minimize') {
    mainWindow.minimize();
  } else if(type === 'close') {
    if (tray) {
      (tray as any).closeApp();
    }
  }

  (tray as any)?.updateContextMenu();
  sendIpcReplyAndDeleteJob(jobId, null, '');
}

export const getRendererReady = (): boolean => isRendererReady;
