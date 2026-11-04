/* @layer electron-main @kind logic */
import { execFile } from 'child_process';
import { join } from 'path';
import type { AsyncSystemToolRun } from './bridge.type';
import { BRIDGE_SYSTEM32 } from './bridge.constants';
import { systemToolFailure } from './system-tool-failure';

const runSystemToolAsync: AsyncSystemToolRun = (exe, args, { cwd, env } = {}) =>
  new Promise((resolve, reject) => {
    const options = { cwd, env: env ? { ...process.env, ...env } : undefined, windowsHide: true, encoding: 'buffer' } as const;
    execFile(join(BRIDGE_SYSTEM32, exe), args, { ...options, windowsHide: true }, (error, stdout) => (error ? reject(systemToolFailure(exe, error)) : resolve(stdout)));
  });

export { runSystemToolAsync };
