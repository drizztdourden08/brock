/* @layer electron-main @kind logic */
import { execFileSync } from 'child_process';
import { join } from 'path';
import type { SystemToolRun } from './bridge.type';
import { BRIDGE_SYSTEM32 } from './bridge.constants';
import { systemToolFailure } from './system-tool-failure';

const runSystemTool: SystemToolRun = (exe, args, { cwd, env } = {}) => {
  try {
    return execFileSync(join(BRIDGE_SYSTEM32, exe), args, { cwd, env: env ? { ...process.env, ...env } : undefined, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    throw systemToolFailure(exe, error);
  }
};

export { runSystemTool };
