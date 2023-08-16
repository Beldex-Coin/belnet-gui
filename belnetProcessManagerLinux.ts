import { IBelnetProcessManager } from './belnetProcessManager';

export class BelnetLinuxProcessManager implements IBelnetProcessManager {
  async doStartBelnetProcess(): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }

  async doStopBelnetProcess(_duringAppExit: boolean): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }
}
