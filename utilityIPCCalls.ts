import { getEventByJobId } from './ipcNode';
import * as belnetProcessManager from './belnetProcessManager';
import { getMainWindow, getTrayIcon } from './main';
import { IPC_CHANNEL_KEY } from './sharedIpc';

let isRendererReady = false;

export function markRendererReady(jobId: string): void {
  isRendererReady = true;

  void belnetProcessManager.doStartBelnetProcess(jobId);
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
  const event = getEventByJobId(jobId);
  event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, '');
}

export const getRendererReady = (): boolean => isRendererReady;
