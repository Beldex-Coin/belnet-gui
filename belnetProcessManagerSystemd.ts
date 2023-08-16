/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBelnetProcessManager, invoke } from './belnetProcessManager';
import util from 'util';
import { exec } from 'child_process';
import { logLineToAppSide } from './ipcNode';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const execPromisified = util.promisify(exec);

export const isSystemD = async (): Promise<boolean> => {
  try {
    logLineToAppSide('Checking for SystemD.');

    const { stdout, stderr } = await execPromisified(
      'ps --no-headers -o comm 1'
    );
    if (stdout && stdout.trim() === 'systemd') {
      logLineToAppSide('SystemD: The current system is using systemd.');
      return true;
    }
    console.log('isSystemD stderr:', stderr);
    logLineToAppSide(`The current system is NOT using systemd: ${stderr}`);

    return false;
  } catch (e: any) {
    logLineToAppSide(`The current system is NOT using systemd: ${e.message}`);

    console.error(e); // should contain code (exit code) and signal (that caused the termination).
    return false;
  }
};

const belnetService = 'belnet.service';

export class BelnetSystemDProcessManager implements IBelnetProcessManager {
  async checkForActiveBelnetService(): Promise<boolean> {
    let result;
    try {
      logLineToAppSide('SystemD: checking if belnet is already running');
      const cmdWithArgs = `systemctl is-active ${belnetService}`;

      result = await execPromisified(cmdWithArgs);
      if (result?.stdout?.trim() === 'active') {
        logLineToAppSide('SystemD: belnet is already running');
        return true;
      }
    } catch (e: any) {
      if (e?.stdout?.trim() === 'inactive') {
        logLineToAppSide(
          'SystemD: belnet service is not running. About to try to start it'
        );
      } else {
        logLineToAppSide(
          `SystemD: checking if belnet is running failed with: ${e}`
        );

        console.info(e);
      }
    }
    return false;
  }

  async doStartBelnetProcess(): Promise<string | null> {
    const isRunning = await this.checkForActiveBelnetService();

    if (isRunning) {
      return null;
    }
    const result = await invoke('systemctl', [
      '--no-block',
      'start',
      belnetService
    ]);

    if (!result) {
      logLineToAppSide('SystemD: belnet service started');
    }
    return result;
  }

  async doStopBelnetProcess(duringAppExit = false): Promise<string | null> {
    if (!duringAppExit) {
      const isRunning = await this.checkForActiveBelnetService();

      if (!isRunning) {
        return null;
      }
    }
    logLineToAppSide('SystemD: belnet service stop action called');
    return invoke('systemctl', ['--no-block', 'stop', belnetService]);
  }
}
