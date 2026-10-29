/* @layer tooling-scripts @kind logic */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { REUSE_DIR, REUSE_VERSION } from './build-reuse.constants.mjs';
import { contentStampOf, listingStampOf } from './file-stamp.mjs';
import { placedStale } from './placed-packages.mjs';
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
 * @param {{ key: string, repo: Record<string, string>, repoDirs: Record<string, string>, placed?: Record<string, unknown>, files: Record<string, string | null>, dirs: Record<string, string | null>, outputs: { fileName: string, base64: string }[], preflight?: string }} content
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

const tableCurrent = (table, read) => Object.entries(table ?? {}).every(([path, recorded]) => recorded !== null && read(path) === recorded);

const placedCurrent = (placed, rootDir, cacheDir) => countOf(placed) === 0 || (Boolean(rootDir) && placedStale(placed, rootDir, cacheDir) === null);

const stampsCurrent = (store, stamp) => tableCurrent(store.files, stamp ?? contentStampOf) && tableCurrent(store.dirs, stamp ?? listingStampOf);

/**
 * @param {object | null} store what readStore gave
 * @param {string} key the key of the build about to run
 * @param {{ stamp?: (file: string) => string | null, snapshot?: import('./repo-snapshot.mjs').RepoSnapshot | null, rootDir?: string, cacheDir?: string }} [check] reads file keys; rootDir is needed for compiled packages
 * @returns {boolean} true while every key matches
 */
const storeIsCurrent = (store, key, { stamp, snapshot = null, rootDir = null, cacheDir } = {}) => {
  if (!store || store.version !== REUSE_VERSION || store.key !== key) return false;
  if (!holdsBundle(store) || !repoKeysCurrent(store, snapshot)) return false;
  return placedCurrent(store.placed, rootDir, cacheDir) && stampsCurrent(store, stamp);
};

export { readStore, storeFile, storeIsCurrent, writeStore };
