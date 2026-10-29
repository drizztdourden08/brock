/* @layer tooling-scripts @kind logic */
import { spawn } from 'node:child_process';
import { mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { brockBin } from './run-brock.mjs';
import { PREWARM_DIR, PREWARM_LOG, PREWARM_MAX_MS, PREWARM_PID, PREWARM_POLL_MS } from './prewarm.constants.mjs';

const pidFileOf = (appDir) => join(appDir, ...PREWARM_DIR, PREWARM_PID);

const isAlive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

/**
 * @param {string} appDir
 * @param {() => number} [now]
 * @returns {number | null} the pid of a pre-bundle still running for this app
 */
const runningPrewarm = (appDir, now = Date.now) => {
  try {
    const { pid, startedAt } = JSON.parse(readFileSync(pidFileOf(appDir), 'utf8'));
    return now() - startedAt < PREWARM_MAX_MS && isAlive(pid) ? pid : null;
  } catch {
    return null;
  }
};

/**
 * @param {string} appDir an Electron app folder
 * @param {(message: string) => void} log
 * @returns {boolean} whether the background pre-bundle started
 */
const startPrewarm = (appDir, log) => {
  const bin = brockBin(appDir);
  if (!bin || runningPrewarm(appDir)) return false;
  const dir = join(appDir, ...PREWARM_DIR);
  mkdirSync(dir, { recursive: true });
  const out = openSync(join(dir, PREWARM_LOG), 'w');
  const child = spawn(process.execPath, [bin, 'prewarm'], { cwd: appDir, detached: true, stdio: ['ignore', out, out], windowsHide: true });
  writeFileSync(pidFileOf(appDir), JSON.stringify({ pid: child.pid, startedAt: Date.now() }));
  child.unref();
  log(`Pre-bundling the renderer dependencies of ${appDir} in the background (log: ${join(dir, PREWARM_LOG)}).`);
  return true;
};

/**
 * @param {string} appDir an Electron app folder
 * @param {(message: string) => void} log
 * @returns {Promise<void>} once no pre-bundle of this app runs
 */
const afterPrewarm = async (appDir, log) => {
  if (!runningPrewarm(appDir)) return;
  log('The background pre-bundle of the renderer dependencies is still running; the launch starts when it ends.');
  while (runningPrewarm(appDir)) await delay(PREWARM_POLL_MS);
  rmSync(pidFileOf(appDir), { force: true });
};

export { afterPrewarm, runningPrewarm, startPrewarm };
