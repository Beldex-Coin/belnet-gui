/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow, screen, Tray, dialog } from 'electron';
import { initializeIpcNodeSide, logLineToAppSide } from './ipcNode';
import { doStopBelnetProcess } from './belnetProcessManager';
import { closeRpcConnection } from './belnetRpcCall';
import { createTrayIcon } from './trayIcon';
import  { autoUpdater } from "electron-updater";

import { markShouldQuit, shouldQuit } from './windowState';
import ElectronStore from 'electron-store';

let updateInterval = null;
let updateNotAvailable = false;
let updateCheck = false;
let updateFound = false;
let store: ElectronStore | undefined;
const configScreenIndex = 'SCREEN_INDEX';

let mainWindow: BrowserWindow | null;
let tray: Tray | null = null;
let ready = false;

function isMacOS() {
  return process.platform === 'darwin';
}

function isLinux() {
  return process.platform !== 'win32' && !isMacOS();
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function getTrayIcon(): Tray | null {
  return tray;
}

async function createWindow() {
  if (!store) {
    store = new ElectronStore();
  }

  let validScreenIndexToUse: number | undefined;

  const allDisplays = screen.getAllDisplays();
  if (store.has(configScreenIndex)) {
    const screenIndexFromStore = store.get(configScreenIndex) as
      | number
      | undefined;

    if (
      screenIndexFromStore !== undefined &&
      allDisplays.length <= screenIndexFromStore
    ) {
      validScreenIndexToUse = screenIndexFromStore;
    }
  }
  const openDevTools = false;

  const isDev = process.env.NODE_ENV === 'development';
  const indexToUse = validScreenIndexToUse || 0;
  const bounds = allDisplays[indexToUse].bounds;


  const width =  421;
  const height = 800;
  // let appIcon = "./build/256x256.png";
  // const WIN = 'win32';

  // if (process.platform === WIN) {
  //   appIcon = "./build/512x512.png";
  // } else {
  //   appIcon = "./build/256x256.png";
  // }
  mainWindow = new BrowserWindow({
    width: 421,
    height,
    maxHeight: height,
    maxWidth: width,
    minHeight: height,
    minWidth: width,
    resizable: true,
    //icon: appIcon,
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
      webSecurity: true,
    },
    backgroundColor: '#fff',
    autoHideMenuBar: true,
    frame: false,
    x: Math.floor(bounds.x + bounds.width / 2 - width / 2),
    y: Math.floor(bounds.y + bounds.height / 2 - height / 2)
  });
  ready = true;

  if (!isMacOS()) {
    tray = createTrayIcon(getMainWindow);
  }

  if (isDev) {
    mainWindow.loadURL(`http://localhost:4000`);
    if (openDevTools) {
      mainWindow.webContents.openDevTools({ mode: 'right' });
    }
  } else {
    mainWindow.loadFile('./dist/index.html');
    if (openDevTools) {
      mainWindow.webContents.openDevTools({ mode: 'right' });
    }
  }
  // if you hide the menu the shortcut CTLR-Q won't work
  // mainWindow.removeMenu();
  await initializeIpcNodeSide(getMainWindow);

  // Emitted when the window is about to be closed.
  // Note: We do most of our shutdown logic here because all windows are closed by
  //   Electron before the app quits.
  mainWindow.on('close', async (e: any) => {
    if (!mainWindow || shouldQuit()) {
      return;
    }
    // Prevent the shutdown
    e.preventDefault();
    mainWindow.hide();

    // toggle the visibility of the show/hide tray icon menu entries

    if (!isMacOS()) {
      (tray as any)?.updateContextMenu();
    }

    return;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

let stopEverythingDone = false;
app.on('before-quit', async (event) => {
  console.log('before-quit event');
  void closeRpcConnection();
  if (!process.env.DISABLE_AUTO_START_STOP) {
  console.log('belnet stop called');
  if (isLinux()) {
    console.info('just triggering belnet daemon stop');
    void doStopBelnetProcess('stop_everything', true);
  } else {
    if (stopEverythingDone) {
      return;
    }
    event.preventDefault();
    console.info('waiting for belnet daemon to stop');
    await doStopBelnetProcess('stop_everything', true);
    console.info('belnet daemon stopped');
    stopEverythingDone = true;
    tray?.destroy();
    markShouldQuit();
    // we have to call quite ourself as we prevented the event default
    app.quit();
    return;
  }
  } else {
    logLineToAppSide(
      'ENV "DISABLE_AUTO_START_STOP" is set, not auto starting belnet daemon'
    );
  }

  tray?.destroy();
  markShouldQuit();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!ready) {
    return;
  }

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow) {
    mainWindow.show();
  } else {
    createWindow();
  }
});

// Defense in depth. We never intend to open webviews or windows. Prevent it completely.
app.on('web-contents-created', (createEvent, contents) => {
  contents.on('will-attach-webview', (attachEvent) => {
    attachEvent.preventDefault();
  });
  contents.on('new-window', (newEvent) => {
    newEvent.preventDefault();
  });
});

app.on('ready', () => {
  createWindow();
  updateInterval = setInterval(() => autoUpdater.checkForUpdates(), 600000);

} );

autoUpdater.on("update-available", (_event: any, releaseNotes: any, releaseName: any) => {
  const dialogOpts = {
      type: 'info',
      buttons: ['Ok'],
      title: `${autoUpdater.channel} Update Available`,
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: `A new ${autoUpdater.channel} version download started.`
  };

  if (!updateCheck) {
      updateInterval = null;
      dialog.showMessageBox(dialogOpts);
      updateCheck = true;
  }
});

autoUpdater.on("update-downloaded", (_event) => {
  if (!updateFound) {
      updateInterval = null;
      updateFound = true;

      setTimeout(() => {
          autoUpdater.quitAndInstall();
      }, 3500);
  }
});

autoUpdater.on("update-not-available", (_event) => {
  const dialogOpts = {
      type: 'info',
      buttons: ['Ok'],
      title: `Update Not available for ${autoUpdater.channel}`,
      message: "A message!",
      detail: `Update Not available for ${autoUpdater.channel}`
  };

  if (!updateNotAvailable) {
      updateNotAvailable = true;
      dialog.showMessageBox(dialogOpts);
  }
});
app.allowRendererProcessReuse = true;
