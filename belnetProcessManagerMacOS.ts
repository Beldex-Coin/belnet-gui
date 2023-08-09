import { IBelnetProcessManager, invoke } from './belnetProcessManager';
import { app } from 'electron';
import { dirname } from 'path';

function getBelnetControlLocation() {
    // We will be at: Belnet.app/Contents/Helpers/Belnet-GUI.app/Contents/MacOS/Belnet-GUI, we want to back to
    // Belnet.app/Contents/MacOS/Belnet:
    return dirname(dirname(dirname(dirname(dirname(app.getPath("exe")))))) + "/MacOS/Belnet";
}

export class BelnetMacOSProcessManager implements IBelnetProcessManager {
  doStartBelnetProcess(): Promise<string | null> {
    return invoke(getBelnetControlLocation(), ["--start"]);
  }

  doStopBelnetProcess(): Promise<string | null> {
    return invoke(getBelnetControlLocation(), ["--stop"]);
  }

  getBelnetBinLocation(): string {
    return app.getPath("Belnet");
  }

  getDefaultBootstrapFileLocation(): string {
    return "";
  }
}
