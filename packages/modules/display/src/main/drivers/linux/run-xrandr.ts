/* @layer electron-main @kind logic */
import { execFileSync } from 'node:child_process';
import { XRANDR_TIMEOUT_MS } from './linux.constants';

const runXrandr = (args: string[]): string | null => {
  try {
    return execFileSync('xrandr', args, { encoding: 'utf8', timeout: XRANDR_TIMEOUT_MS, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
};

export { runXrandr };
