/* @layer tooling-scripts @kind logic */
import { copyFileSync, cpSync, existsSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { cp } from 'node:fs/promises';
import { join } from 'node:path';
import { commitEntry } from '../store/commit-entry.mjs';
import { cacheRoot } from '../store/cache-root.mjs';
import { hashTree } from '../store/hash-tree.mjs';
import { readEntry, touchEntry } from '../store/read-entry.mjs';
import { KIND } from '../store/store.constants.mjs';
import { DIST_DIR, PATH_FILE, PLATFORM_OVERRIDES, VERSION_FILE } from './electron-cache.constants.mjs';

const readText = (file) => {
  try {
    return readFileSync(file, 'utf8').trim();
  } catch {
    return null;
  }
};

/**
 * @param {string} root the cache root
 * @param {string} packageDir the installed electron package folder
 * @param {Record<string, string | undefined>} [env]
 * @returns {import('../store/entry-path.mjs').EntryId | null} null when installing for another platform
 */
const electronEntryId = (root, packageDir, env = process.env) => {
  if (PLATFORM_OVERRIDES.some((name) => env[name])) return null;
  const version = (() => {
    try {
      return JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8')).version;
    } catch {
      return null;
    }
  })();
  return typeof version === 'string' && version ? { root, kind: KIND.ELECTRON, name: 'electron', version, buildKey: `${process.platform}-${process.arch}` } : null;
};

/**
 * @param {string} packageDir
 * @param {string} version
 * @returns {boolean} the package has its extracted binary for that version
 */
const distIsReady = (packageDir, version) => {
  const executable = readText(join(packageDir, PATH_FILE));
  if (!executable || !existsSync(join(packageDir, DIST_DIR, executable))) return false;
  return readText(join(packageDir, DIST_DIR, VERSION_FILE))?.replace(/^v/, '') === version;
};

/**
 * @param {string} packageDir the installed electron package folder
 * @param {{ root?: string }} [options]
 * @returns {'ready' | 'restored' | 'missing' | 'skipped'} restored: copied in, hash checked
 */
const restoreElectron = (packageDir, { root = cacheRoot() } = {}) => {
  const id = electronEntryId(root, packageDir);
  if (!id) return 'skipped';
  if (distIsReady(packageDir, id.version)) return 'ready';
  const entry = readEntry(id, { verify: false });
  if (!entry?.manifest.distHash) return 'missing';
  const dist = join(packageDir, DIST_DIR);
  const partial = `${dist}.${process.pid}.tmp`;
  try {
    rmSync(partial, { recursive: true, force: true });
    cpSync(join(entry.filesDir, DIST_DIR), partial, { recursive: true, verbatimSymlinks: true });
    if (hashTree(partial).contentHash !== entry.manifest.distHash) return 'missing';
    rmSync(dist, { recursive: true, force: true });
    renameSync(partial, dist);
    copyFileSync(join(entry.filesDir, PATH_FILE), join(packageDir, PATH_FILE));
  } catch {
    return 'missing';
  } finally {
    rmSync(partial, { recursive: true, force: true });
  }
  touchEntry(entry);
  return distIsReady(packageDir, id.version) ? 'restored' : 'missing';
};

/**
 * @param {string} packageDir the installed electron package folder
 * @param {{ root?: string }} [options]
 * @returns {Promise<'stored' | 'present' | 'not-ready' | 'skipped'>} stored: added to the cache
 */
const storeElectron = async (packageDir, { root = cacheRoot() } = {}) => {
  const id = electronEntryId(root, packageDir);
  if (!id) return 'skipped';
  if (!distIsReady(packageDir, id.version)) return 'not-ready';
  const present = readEntry(id, { verify: false });
  if (present) {
    touchEntry(present);
    return 'present';
  }
  await commitEntry({
    ...id,
    buildSettings: { platform: process.platform, arch: process.arch },
    fill: async (filesDir) => {
      await cp(join(packageDir, DIST_DIR), join(filesDir, DIST_DIR), { recursive: true, verbatimSymlinks: true });
      copyFileSync(join(packageDir, PATH_FILE), join(filesDir, PATH_FILE));
      return { distHash: hashTree(join(filesDir, DIST_DIR)).contentHash };
    },
  });
  return 'stored';
};

export { distIsReady, electronEntryId, restoreElectron, storeElectron };
