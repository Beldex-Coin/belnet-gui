import { IBelnetProcessManager, invoke } from './belnetProcessManager';

export class BelnetMacOSProcessManager implements IBelnetProcessManager {
  doStartBelnetProcess(): Promise<string | null> {
    const startNotification =
      '-e \'display notification "We should start BELNET mac extension"\'';
    return invoke('osascript', [startNotification]);
  }

  doStopBelnetProcess(): Promise<string | null> {
    const stopNotification =
      '-e \'display notification "We should stop BELNET mac extension"\'';

    return invoke('osascript', [stopNotification]);
  }

  getDefaultBootstrapFileLocation(): string {
    throw new Error('FIXME');
    return 'C:\\ProgramData\\belnet\\bootstrap.signed';
  }
}
