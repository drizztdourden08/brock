/* @layer electron-main @kind logic */
import { execFileSync } from 'child_process';
import { join } from 'path';
import type { SystemToolRun } from './bridge.type';
import { BRIDGE_SYSTEM32 } from './bridge.constants';

const outputOf = (error: unknown, key: 'stderr' | 'stdout'): string => {
  const value: unknown = error instanceof Error && key in error ? Reflect.get(error, key) : null;
  return Buffer.isBuffer(value) ? value.toString('latin1').trim() : '';
};

const statusOf = (error: unknown): string => String(error instanceof Error && 'status' in error ? error.status : null);

const detailOf = (error: unknown): string => outputOf(error, 'stderr') || outputOf(error, 'stdout') || String(error);

const runSystemTool: SystemToolRun = (exe, args, { cwd, env } = {}) => {
  try {
    return execFileSync(join(BRIDGE_SYSTEM32, exe), args, { cwd, env: env ? { ...process.env, ...env } : undefined, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    throw new Error(`${exe} exited with ${statusOf(error)}: ${detailOf(error).slice(0, 400)}`, { cause: error });
  }
};

export { runSystemTool };
