import { IBelnetProcessManager, invoke } from './belnetProcessManager';

export class BelnetWindowsProcessManager implements IBelnetProcessManager {
  doStartBelnetProcess(): Promise<string | null> {
    return invoke('net', ['start', 'belnet']);
  }

  doStopBelnetProcess(): Promise<string | null> {
    return invoke('net', ['stop', 'belnet']);
  }

  getDefaultBootstrapFileLocation(): string {
    return 'C:\\ProgramData\\belnet\\bootstrap.signed';
  }
}
