/* @layer electron-main @kind logic */
import { execFileSync } from 'child_process';
import { join } from 'path';
import type { SystemToolRun } from './bridge.type';
import { BRIDGE_SYSTEM32 } from './bridge.constants';

const runSystemTool: SystemToolRun = (exe, args, cwd) =>
  execFileSync(join(BRIDGE_SYSTEM32, exe), args, { cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] });

export { runSystemTool };
