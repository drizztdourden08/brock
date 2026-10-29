/* @layer tooling-scripts @kind logic */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { REUSE_DIR, REUSE_VERSION } from './build-reuse.constants.mjs';
import { stampOf } from './file-stamp.mjs';
import { repoKeysCurrent } from './module-keys.mjs';

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
 * @param {{ key: string, repo: Record<string, string>, repoDirs: Record<string, string>, files: Record<string, string | null>, dirs: Record<string, string | null>, outputs: { fileName: string, base64: string }[] }} content
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

const countOf = (table) => Object.keys(table ?? {}).length;

const holdsBundle = (store) => Array.isArray(store.outputs) && store.outputs.length > 0 && countOf(store.files) + countOf(store.repo) > 0;

/**
 * @param {object | null} store what readStore gave
 * @param {string} key the key of the build about to run
 * @param {{ stamp?: (file: string) => string | null, snapshot?: import('./repo-snapshot.mjs').RepoSnapshot | null }} [check] reads file stamps and repository keys
 * @returns {boolean} true while every key and stamp matches
 */
const storeIsCurrent = (store, key, { stamp = stampOf, snapshot = null } = {}) => {
  if (!store || store.version !== REUSE_VERSION || store.key !== key) return false;
  if (!holdsBundle(store) || !repoKeysCurrent(store, snapshot)) return false;
  return Object.entries({ ...store.files, ...store.dirs }).every(([path, recorded]) => recorded !== null && stamp(path) === recorded);
};

export { readStore, storeFile, storeIsCurrent, writeStore };
