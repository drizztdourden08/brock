/* @layer tooling-scripts @kind logic */
import { closeSync, openSync, rmSync, statSync, writeSync } from 'node:fs';
import { join } from 'node:path';
import { LOCK_POLL_MS, LOCK_STALE_MS, RESTORE_LOCK } from './electron-cache.constants.mjs';

const pause = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

const tryLock = (file) => {
  try {
    const handle = openSync(file, 'wx');
    writeSync(handle, `${process.pid}\n`);
    closeSync(handle);
    return true;
  } catch {
    return false;
  }
};

const isStale = (file, now) => {
  const stat = statSync(file, { throwIfNoEntry: false });
  return !stat || now() - stat.mtimeMs > LOCK_STALE_MS;
};

/**
 * @template T
 * @param {string} packageDir the installed electron package folder
 * @param {() => T} work runs while no other process restores here
 * @param {() => number} [now]
 * @returns {T} what work returned
 */
const withRestoreLock = (packageDir, work, now = Date.now) => {
  const file = join(packageDir, RESTORE_LOCK);
  while (!tryLock(file)) {
    if (isStale(file, now)) rmSync(file, { force: true });
    else pause(LOCK_POLL_MS);
  }
  try {
    return work();
  } finally {
    rmSync(file, { force: true });
  }
};

export { withRestoreLock };
