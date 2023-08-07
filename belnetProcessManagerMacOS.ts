import { IBelnetProcessManager, invoke } from './belnetProcessManager';
import { app } from 'electron';

export class BelnetMacOSProcessManager implements IBelnetProcessManager {
  doStartBelnetProcess(): Promise<string | null> {
    return invoke(getBelnetBinLocation(), ["--start"]);
  }

  doStopBelnetProcess(): Promise<string | null> {
    return invoke(getBelnetBinLocation(), ["--stop"]);
  }

  getBelnetBinLocation(): string {
    return app.getPath("belnet");
  }

  getDefaultBootstrapFileLocation(): string {
    return "";
  }
}
