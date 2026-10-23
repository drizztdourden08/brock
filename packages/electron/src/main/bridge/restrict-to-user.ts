/* @layer electron-main @kind logic */
import { resolve } from 'path';
import type { SystemToolRun } from './bridge.type';
import { runSystemTool } from './run-system-tool';
import { windowsUser } from './windows-user';

const restrictToUser = (file: string, run: SystemToolRun = runSystemTool): void => {
  run('icacls.exe', [resolve(file), '/inheritance:r', '/grant:r', `*${windowsUser(run).sid}:(F)`]);
};

export { restrictToUser };
