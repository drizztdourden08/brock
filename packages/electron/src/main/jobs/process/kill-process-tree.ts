/* @layer electron-main @kind logic */
import { spawn } from 'child_process';
import { join } from 'path';
import { TASKKILL_GONE } from './process-job.constants';
import type { Killable, KillResult } from './process-job.type';

const isRunning = (child: Killable): boolean =>
  child.exitCode === null && child.signalCode === null && child.pid !== undefined && Number.isInteger(child.pid) && child.pid > 0;

const taskkill = (pid: number, force: boolean): Promise<KillResult> =>
  new Promise((resolve) => {
    const root = process.env['SystemRoot'] ?? 'C:\\Windows';
    const args = ['/T', ...(force ? ['/F'] : []), '/PID', String(pid)];
    const child = spawn(join(root, 'System32', 'taskkill.exe'), args, { shell: false, windowsHide: true, stdio: 'ignore' });
    child.on('error', () => resolve('refused'));
    child.on('close', (code) => {
      if (code === 0) resolve('sent');
      else resolve(code === TASKKILL_GONE ? 'gone' : 'refused');
    });
  });

const signalGroup = (pid: number, signal: NodeJS.Signals): KillResult => {
  try {
    process.kill(-pid, signal);
    return 'sent';
  } catch (error) {
    return error instanceof Error && 'code' in error && error.code === 'ESRCH' ? 'gone' : 'refused';
  }
};

const killProcessTree = (child: Killable, force: boolean): Promise<KillResult> => {
  if (!isRunning(child) || child.pid === undefined) return Promise.resolve('gone');
  if (process.platform === 'win32') return taskkill(child.pid, force);
  return Promise.resolve(signalGroup(child.pid, force ? 'SIGKILL' : 'SIGTERM'));
};

export { killProcessTree };
