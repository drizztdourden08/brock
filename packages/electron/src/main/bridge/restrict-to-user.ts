/* @layer electron-main @kind logic */
import { basename, dirname, resolve } from 'path';
import type { SystemToolRun } from './bridge.type';
import { runSystemTool } from './run-system-tool';
import { windowsUser } from './windows-user';

const restrictToUser = (file: string, run: SystemToolRun = runSystemTool): void => {
  const full = resolve(file);
  const { sid } = windowsUser(run);
  run('icacls.exe', [basename(full), '/inheritance:r', '/grant:r', `*${sid}:(F)`], { cwd: dirname(full) });
};

export { restrictToUser };
