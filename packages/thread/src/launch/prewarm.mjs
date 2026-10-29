/* @layer tooling-scripts @kind logic */
import { spawn } from 'node:child_process';
import { mkdirSync, openSync } from 'node:fs';
import { join } from 'node:path';
import { announceJob, jobState, waitForJob } from '@drizztdourden08/build-cache/jobs';
import { brockBin } from './run-brock.mjs';
import { PREWARM_DIR, PREWARM_LABEL, PREWARM_LOG, PREWARM_RECORD } from './prewarm.constants.mjs';

/**
 * @param {string} appDir an Electron app folder
 * @returns {string} the job record the prewarm keeps for this app
 */
const prewarmRecord = (appDir) => join(appDir, ...PREWARM_DIR, PREWARM_RECORD);

/**
 * @param {string} appDir an Electron app folder
 * @param {(message: string) => void} log
 * @returns {boolean} whether the background prewarm started
 */
const startPrewarm = (appDir, log) => {
  const bin = brockBin(appDir);
  if (!bin || jobState(prewarmRecord(appDir)).running) return false;
  const dir = join(appDir, ...PREWARM_DIR);
  mkdirSync(dir, { recursive: true });
  const out = openSync(join(dir, PREWARM_LOG), 'w');
  const child = spawn(process.execPath, [bin, 'prewarm'], { cwd: appDir, detached: true, stdio: ['ignore', out, out], windowsHide: true });
  announceJob(prewarmRecord(appDir), { pid: child.pid });
  child.unref();
  log(`Prewarming ${appDir} in the background: sync, Electron, main, preload and renderer dependencies (log: ${join(dir, PREWARM_LOG)}).`);
  return true;
};

/**
 * @param {string} appDir an Electron app folder
 * @param {(message: string) => void} log
 * @returns {Promise<boolean>} whether the launch waited for a prewarm
 */
const afterPrewarm = (appDir, log) => waitForJob(prewarmRecord(appDir), PREWARM_LABEL, log);

export { afterPrewarm, prewarmRecord, startPrewarm };
