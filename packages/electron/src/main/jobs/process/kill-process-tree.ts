/* @layer electron-main @kind logic */
import { spawn } from 'child_process';
import { join } from 'path';

const attempt = (action: () => void): boolean => {
  try {
    action();
    return true;
  } catch {
    return false;
  }
};

const taskkill = (pid: number, force: boolean): void => {
  const root = process.env['SystemRoot'] ?? 'C:\\Windows';
  const args = ['/T', ...(force ? ['/F'] : []), '/PID', String(pid)];
  const child = spawn(join(root, 'System32', 'taskkill.exe'), args, { shell: false, windowsHide: true, stdio: 'ignore' });
  child.on('error', () => undefined);
  child.unref();
};

const signalGroup = (pid: number, signal: NodeJS.Signals): void => {
  if (!attempt(() => process.kill(-pid, signal))) attempt(() => process.kill(pid, signal));
};

const killProcessTree = (pid: number | undefined, force: boolean): void => {
  if (pid === undefined || !Number.isInteger(pid) || pid <= 0) return;
  if (process.platform === 'win32') taskkill(pid, force);
  else signalGroup(pid, force ? 'SIGKILL' : 'SIGTERM');
};

export { killProcessTree };
