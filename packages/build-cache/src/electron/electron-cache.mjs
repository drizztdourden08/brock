/* @layer tooling-scripts @kind logic */
import { spawn } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { cp } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { commitEntry, discardEntry } from '../store/commit-entry.mjs';
import { cacheRoot } from '../store/cache-root.mjs';
import { hashTree } from '../store/hash-tree.mjs';
import { readEntry, touchEntry } from '../store/read-entry.mjs';
import { CACHE_ENV, KIND } from '../store/store.constants.mjs';
import { DIST_DIR, OVERRIDE_ENV, PATH_FILE, VERSION_FILE } from './electron-cache.constants.mjs';
import { electronTarget } from './electron-target.mjs';
import { withRestoreLock } from './restore-lock.mjs';

const STORE_CLI = fileURLToPath(new URL('./store-electron-cli.mjs', import.meta.url));

const readText = (file) => {
  try {
    return readFileSync(file, 'utf8').trim();
  } catch {
    return null;
  }
};

const versionOf = (packageDir) => {
  try {
    return JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8')).version;
  } catch {
    return null;
  }
};

/**
 * @param {string} root the cache root
 * @param {string} packageDir the installed electron package folder
 * @param {Record<string, string | undefined>} [env]
 * @returns {import('../store/entry-path.mjs').EntryId | null} null when Electron runs from elsewhere
 */
const electronEntryId = (root, packageDir, env = process.env) => {
  if (env[OVERRIDE_ENV]) return null;
  const version = versionOf(packageDir);
  if (typeof version !== 'string' || !version) return null;
  const { platform, arch } = electronTarget(packageDir, env);
  return { root, kind: KIND.ELECTRON, name: 'electron', version, buildKey: `${platform}-${arch}` };
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

const copyIn = (entry, root, packageDir, version) => {
  const dist = join(packageDir, DIST_DIR);
  const partial = `${dist}.${process.pid}.tmp`;
  try {
    rmSync(partial, { recursive: true, force: true });
    cpSync(join(entry.filesDir, DIST_DIR), partial, { recursive: true, verbatimSymlinks: true });
    if (hashTree(partial).contentHash !== entry.manifest.distHash) {
      discardEntry(entry.dir, root);
      return 'missing';
    }
    if (distIsReady(packageDir, version)) return 'ready';
    rmSync(dist, { recursive: true, force: true });
    renameSync(partial, dist);
    copyFileSync(join(entry.filesDir, PATH_FILE), join(packageDir, PATH_FILE));
    touchEntry(entry);
    return distIsReady(packageDir, version) ? 'restored' : 'missing';
  } catch {
    return 'missing';
  } finally {
    rmSync(partial, { recursive: true, force: true });
  }
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
  return withRestoreLock(packageDir, () => {
    if (distIsReady(packageDir, id.version)) return 'ready';
    const entry = readEntry(id, { verify: false });
    return entry?.manifest.distHash ? copyIn(entry, root, packageDir, id.version) : 'missing';
  });
};

/**
 * @param {string} packageDir the installed electron package folder
 * @param {{ root?: string }} [options]
 * @returns {Promise<'stored' | 'present' | 'not-ready' | 'skipped'>} stored: added, or a bad entry replaced
 */
const storeElectron = async (packageDir, { root = cacheRoot() } = {}) => {
  const id = electronEntryId(root, packageDir);
  if (!id) return 'skipped';
  if (!distIsReady(packageDir, id.version)) return 'not-ready';
  const present = readEntry(id);
  if (present?.manifest.distHash) {
    touchEntry(present);
    return 'present';
  }
  await commitEntry({
    ...id,
    buildSettings: electronTarget(packageDir),
    fill: async (filesDir) => {
      await cp(join(packageDir, DIST_DIR), join(filesDir, DIST_DIR), { recursive: true, verbatimSymlinks: true });
      copyFileSync(join(packageDir, PATH_FILE), join(filesDir, PATH_FILE));
      return { distHash: hashTree(join(filesDir, DIST_DIR)).contentHash };
    },
  });
  return 'stored';
};

/**
 * @param {string} packageDir the installed electron package folder
 * @param {{ root?: string }} [options]
 * @returns {void} stores in a detached process that outlives this one
 */
const storeElectronDetached = (packageDir, { root = cacheRoot() } = {}) => {
  const id = electronEntryId(root, packageDir);
  if (!id || !distIsReady(packageDir, id.version)) return;
  const present = readEntry(id, { verify: false });
  if (present?.manifest.distHash) {
    touchEntry(present);
    return;
  }
  const child = spawn(process.execPath, [STORE_CLI, packageDir], { detached: true, stdio: 'ignore', windowsHide: true, env: { ...process.env, [CACHE_ENV]: root } });
  child.unref();
};

export { distIsReady, electronEntryId, restoreElectron, storeElectron, storeElectronDetached };
