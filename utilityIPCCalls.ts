import { sendIpcReplyAndDeleteJob } from './ipcNode';

import { getMainWindow, getTrayIcon } from './main';


let isRendererReady = false;

export function markRendererReady(jobId: string): void {
  isRendererReady = true;

  sendIpcReplyAndDeleteJob(jobId, null, '');
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

  if (tray) {
    (tray as any).updateContextMenu();
  }
  sendIpcReplyAndDeleteJob(jobId, null, '');
}

export const getRendererReady = (): boolean => isRendererReady;
