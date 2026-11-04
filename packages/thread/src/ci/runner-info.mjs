/* @layer tooling-scripts @kind logic */
import { execSync } from 'node:child_process';
import { hostname, platform, release } from 'node:os';

const pnpmVersion = () => {
  try {
    return execSync('pnpm --version', { windowsHide: true, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return 'unknown';
  }
};

/**
 * @returns {{ host: string, os: string, node: string, pnpm: string }}
 */
const runnerInfo = () => ({ host: hostname(), os: `${platform()} ${release()}`, node: process.version, pnpm: pnpmVersion() });

export { runnerInfo };
