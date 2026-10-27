/* @layer tooling-scripts @kind logic */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { REUSE_DIR, REUSE_VERSION } from './build-reuse.constants.mjs';
import { stampOf } from './file-stamp.mjs';

/**
 * @param {string} rootDir
 * @param {string} target main or preload
 * @returns {string} the file that keeps the last bundle of that target
 */
const storeFile = (rootDir, target) => join(rootDir, REUSE_DIR, `${target}.json`);

/**
 * @param {string} file
 * @returns {object | null} the stored bundle, or null when none is readable
 */
const readStore = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

/**
 * @param {string} file
 * @param {{ key: string, files: Record<string, string>, dirs: Record<string, string>, outputs: { fileName: string, base64: string }[] }} content
 * @returns {boolean} whether it was written
 */
const writeStore = (file, content) => {
  const partial = `${file}.${process.pid}.tmp`;
  try {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(partial, JSON.stringify({ version: REUSE_VERSION, ...content }));
    renameSync(partial, file);
    return true;
  } catch {
    return false;
  }
};

/**
 * @param {object | null} store what readStore gave
 * @param {string} key the key of the build about to run
 * @param {(file: string) => string | null} [stamp] reads a file stamp
 * @returns {boolean} true while the key and every file stamp match
 */
const storeIsCurrent = (store, key, stamp = stampOf) => {
  if (!store || store.version !== REUSE_VERSION || store.key !== key) return false;
  if (!Array.isArray(store.outputs) || store.outputs.length === 0) return false;
  if (!store.files || Object.keys(store.files).length === 0) return false;
  return Object.entries({ ...store.files, ...store.dirs }).every(([path, recorded]) => recorded !== null && stamp(path) === recorded);
};

export { readStore, storeFile, storeIsCurrent, writeStore };
