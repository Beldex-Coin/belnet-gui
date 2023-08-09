/* eslint-disable @typescript-eslint/no-explicit-any */
import util from 'util';
import {
  getEventByJobId,
  logLineToAppSide,
  sendGlobalErrorToAppSide
} from './ipcNode';
import { BelnetLinuxProcessManager } from './belnetProcessManagerLinux';
import {
  BelnetSystemDProcessManager,
  isSystemD
} from './belnetProcessManagerSystemd';

import { BelnetWindowsProcessManager } from './belnetProcessManagerWindows';

import { IPC_CHANNEL_KEY } from './sharedIpc';
import { exec } from 'child_process';
import { BelnetMacOSProcessManager } from './belnetProcessManagerMacOS';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const execPromisified = util.promisify(exec);
// eslint-disable-next-line @typescript-eslint/no-var-requires

const LINUX = 'linux';
const WIN = 'win32';
const MACOS = 'darwin';

export const invoke = async (
  cmd: string,
  args: Array<string>
): Promise<string | null> => {
  const cmdWithArgs = `${cmd} ${args.join(' ')}`;
  console.log('running cmdWithArgs', cmdWithArgs);
  try {
    const result = await execPromisified(cmdWithArgs);
    if (result && (result.stdout || result.stderr)) {
      console.info(`Failed to invoke: '${cmdWithArgs}'`);
      console.info(`result: `, result);
      return result.stdout || result.stderr || null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.info('invoke failed with', e);
    const stderr = e.stderr ? e.stderr : '';
    const stdout = e.stdout ? e.stdout : '';
    const cmd = e.cmd ? `${e.cmd}: ` : '';
    logLineToAppSide(`invoke failed with: ${e}`);
    return `${cmd}${stdout}  ${stderr}`;
  }

  return null;
};

export interface IBelnetProcessManager {
  doStartBelnetProcess: () => Promise<string | null>;
  doStopBelnetProcess: () => Promise<string | null>;
}

let belnetProcessManager: IBelnetProcessManager;

const getBelnetProcessManager = async () => {
  logLineToAppSide('Checking the current System OS');
  if (belnetProcessManager) {
    return belnetProcessManager;
  }

  if (process.platform === WIN) {
    logLineToAppSide('Current system is windows');

    belnetProcessManager = new BelnetWindowsProcessManager();
    return belnetProcessManager;
  }

  if (process.platform === MACOS) {
    logLineToAppSide('Current system is macos');

    belnetProcessManager = new BelnetMacOSProcessManager();
    return belnetProcessManager;
  }

  if (process.platform === LINUX) {
    if (await isSystemD()) {
      belnetProcessManager = new BelnetSystemDProcessManager();
      return belnetProcessManager;
    }
    logLineToAppSide('Current system is linux but not systemd');

    belnetProcessManager = new BelnetLinuxProcessManager();
    return belnetProcessManager;
  }
  logLineToAppSide('Current system is UNSUPPORTED');

  throw new Error(
    `BelnetProcessManager not implemented for ${process.platform}`
  );
};

export const doStartBelnetProcess = async (jobId: string): Promise<void> => {
  let result: string | undefined;

  if (!process.env.DISABLE_AUTO_START_STOP) {
    try {
      logLineToAppSide('About to start Belnet process');

      const manager = await getBelnetProcessManager();
      const startStopResult = await manager.doStartBelnetProcess();

      if (startStopResult) {
        sendGlobalErrorToAppSide('error-start-stop');
      }
    } catch (e: any) {
      logLineToAppSide(`Belnet process start failed with ${e.message}`);
      console.info('doStartBelnetProcess failed with', e);
      sendGlobalErrorToAppSide('error-start-stop');
    }
  } else {
    logLineToAppSide(
      'ENV "DISABLE_AUTO_START_STOP" is set, not auto starting belnet daemon'
    );
  }
  const event = getEventByJobId(jobId);
  event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, result);
};

/**
 * doStopBelnetProcess is only called when exiting the app so there is no point to wait
 * for the event return and so no jobId argument required
 */
export const doStopBelnetProcess = async (): Promise<void> => {
  try {
    logLineToAppSide('About to stop Belnet process');

    const manager = await getBelnetProcessManager();
    await manager.doStopBelnetProcess();
  } catch (e: any) {
    logLineToAppSide(`Belnet process stop failed with ${e.message}`);

    console.info('doStopBelnetProcess failed with', e);
  }
};

export const doGetProcessPid = (): number => {
  return 0;
};
