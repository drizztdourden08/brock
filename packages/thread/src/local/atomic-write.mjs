/* @layer tooling-scripts @kind logic */
import { copyFileSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const RENAME_TRIES = 6;

const pause = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

/**
 * @param {string} from
 * @param {string} to the final path, replaced whole
 * @returns {void}
 */
const renameWithRetry = (from, to) => {
  for (let attempt = 1; ; attempt += 1) {
    try {
      renameSync(from, to);
      return;
    } catch (error) {
      if (attempt === RENAME_TRIES) throw error;
      pause(40 * attempt);
    }
  }
};

/**
 * @param {string} file
 * @param {string | Uint8Array} data
 * @returns {void} the file appears whole: a temp file, then a rename
 */
const writeFileAtomic = (file, data) => {
  mkdirSync(dirname(file), { recursive: true });
  const staged = `${file}.${process.pid}.tmp`;
  writeFileSync(staged, data);
  renameWithRetry(staged, file);
};

/**
 * @param {string} from
 * @param {string} to
 * @returns {void} the copy appears whole: a temp file, then a rename
 */
const copyFileAtomic = (from, to) => {
  mkdirSync(dirname(to), { recursive: true });
  const staged = `${to}.${process.pid}.tmp`;
  copyFileSync(from, staged);
  renameWithRetry(staged, to);
};

export { copyFileAtomic, renameWithRetry, writeFileAtomic };
