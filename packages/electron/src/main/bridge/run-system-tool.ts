/* @layer electron-main @kind logic */
import { execFileSync } from 'child_process';
import { join } from 'path';
import type { SystemToolRun } from './bridge.type';

const runSystemTool: SystemToolRun = (exe, args) =>
  execFileSync(join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', exe), args, { encoding: 'latin1', windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] });

export { runSystemTool };
