import { IBelnetProcessManager } from './belnetProcessManager';

export class BelnetLinuxProcessManager implements IBelnetProcessManager {
  async doStartBelnetProcess(): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }

  async doStopBelnetProcess(): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }

  getDefaultBootstrapFileLocation(): string {
    throw new Error('getDefaultBootstrapFileLocation TODO for Linux');
  }
}
