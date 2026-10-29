/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { hostname, platform, release } from 'node:os';

const pnpmVersion = () => {
  try {
    return execFileSync('pnpm', ['--version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], shell: process.platform === 'win32' }).trim();
  } catch {
    return 'unknown';
  }
};

/**
 * @returns {{ host: string, os: string, node: string, pnpm: string }}
 */
const runnerInfo = () => ({ host: hostname(), os: `${platform()} ${release()}`, node: process.version, pnpm: pnpmVersion() });

export { runnerInfo };
