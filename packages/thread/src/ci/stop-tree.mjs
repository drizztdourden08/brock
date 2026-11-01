/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';

/**
 * @param {number | undefined} pid
 * @param {{ platform?: string, exec?: Function, kill?: Function }} [deps]
 * @returns {boolean} true when the stop command ran
 */
const stopPid = (pid, { platform = process.platform, exec = execFileSync, kill = process.kill } = {}) => {
  if (!pid) return false;
  try {
    if (platform === 'win32') exec('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
    else kill(pid, 'SIGTERM');
    return true;
  } catch {
    return false;
  }
};

/**
 * @param {{ pid?: number, kill: () => void }} child
 * @param {object} [deps]
 * @returns {void}
 */
const stopTree = (child, deps) => {
  if (stopPid(child.pid, deps)) return;
  try {
    child.kill();
  } catch {
    // The child is already gone.
  }
};

export { stopPid, stopTree };
