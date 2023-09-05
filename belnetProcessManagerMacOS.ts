import { IBelnetProcessManager, invoke } from './belnetProcessManager';
import { logLineToAppSide } from './ipcNode';

import { app } from 'electron';
import { dirname } from 'path';

function getBelnetControlLocation() {
  // We will be at: Belnet.app/Contents/Helpers/Belnet-GUI.app/Contents/MacOS/Belnet-GUI, we want to back to
  // Belnet.app/Contents/MacOS/Belnet:
  const controlLocation =
    dirname(dirname(dirname(dirname(dirname(app.getPath('exe')))))) +
    '/MacOS/Belnet';
  logLineToAppSide(`Belnet bin control location: "${controlLocation}"`);
  return controlLocation;  
}

export class BelnetMacOSProcessManager implements IBelnetProcessManager {
  doStartBelnetProcess(): Promise<string | null> {
    return invoke(getBelnetControlLocation(), ['--start']);
  }

  doStopBelnetProcess(): Promise<string | null> {
    return invoke(getBelnetControlLocation(), ['--stop']);
  }

  getBelnetBinLocation(): string {
    return app.getPath("Belnet");
  }

  getDefaultBootstrapFileLocation(): string {
    return "";
  }
}
