import { IBelnetProcessManager, invoke } from './belnetProcessManager';
import { logLineToAppSide } from './ipcNode';

function getBelnetControlLocation() {
    const belnetControlLocation =
    '/Applications/Belnet.app/Contents/MacOS/Belnet';

  logLineToAppSide(`belnet path: "${belnetControlLocation}"`);
  return belnetControlLocation;
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
