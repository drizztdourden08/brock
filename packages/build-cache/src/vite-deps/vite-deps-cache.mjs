/* @layer tooling-scripts @kind logic */
import { spawn } from 'node:child_process';
import { cpSync, existsSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { cp } from 'node:fs/promises';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cacheRoot } from '../store/cache-root.mjs';
import { commitEntry } from '../store/commit-entry.mjs';
import { entryPaths } from '../store/entry-path.mjs';
import { readEntry, touchEntry } from '../store/read-entry.mjs';
import { CACHE_ENV, KIND } from '../store/store.constants.mjs';
import { filesPresent, localMetadata, matchesHashes, portableMetadata, readMetadata, sourcesPresent } from './deps-metadata.mjs';
import { ENTRY_NAME, LAYOUT, METADATA_FILE, RESTORE_SUFFIX } from './vite-deps.constants.mjs';

const STORE_CLI = fileURLToPath(new URL('./store-vite-deps-cli.mjs', import.meta.url));
const started = new Set();

/**
 * @typedef {{ depsDir: string, installRoot: string, version: string, buildKey: string, hashes: import('./deps-metadata.mjs').DepsHashes, root?: string }} ViteDepsInput
 */

const idOf = ({ root = cacheRoot(), version, buildKey }) => ({ root, kind: KIND.VITE_DEPS, name: ENTRY_NAME, version, buildKey });

const accepted = (depsDir, hashes) => {
  const metadata = readMetadata(depsDir);
  return Boolean(metadata) && matchesHashes(metadata, hashes) && filesPresent(metadata, depsDir);
};

const nearestExisting = (dir) => (existsSync(dir) || dirname(dir) === dir ? dir : nearestExisting(dirname(dir)));

const insideInstall = ({ depsDir, installRoot }) => {
  try {
    const owner = realpathSync(installRoot);
    const parent = realpathSync(nearestExisting(dirname(depsDir)));
    return parent === owner || parent.startsWith(`${owner}${sep}`);
  } catch {
    return false;
  }
};

const replaceDir = (partial, depsDir) => {
  if (existsSync(depsDir)) {
    const stale = `${depsDir}.stale.${process.pid}`;
    renameSync(depsDir, stale);
    rmSync(stale, { recursive: true, force: true });
  }
  renameSync(partial, depsDir);
};

const copyIn = (entry, { depsDir, installRoot, hashes }) => {
  const partial = `${depsDir}${RESTORE_SUFFIX}.${process.pid}`;
  try {
    const stored = readMetadata(entry.filesDir);
    const local = stored && localMetadata(stored, { installRoot, hashes });
    if (!local || !sourcesPresent(local)) return 'missing';
    rmSync(partial, { recursive: true, force: true });
    cpSync(entry.filesDir, partial, { recursive: true });
    writeFileSync(join(partial, METADATA_FILE), `${JSON.stringify(local, null, 2)}\n`);
    if (!accepted(partial, hashes)) return 'missing';
    replaceDir(partial, depsDir);
    touchEntry(entry);
    return 'restored';
  } catch {
    return accepted(depsDir, hashes) ? 'ready' : 'missing';
  } finally {
    rmSync(partial, { recursive: true, force: true });
  }
};

/**
 * @param {ViteDepsInput} input the renderer deps folder and what Vite will compare
 * @returns {'ready' | 'restored' | 'missing'} restored: copied in, hash checked, metadata made current
 */
const restoreViteDeps = (input) => {
  if (accepted(input.depsDir, input.hashes)) return 'ready';
  if (!insideInstall(input)) return 'missing';
  const entry = readEntry(idOf(input));
  return entry ? copyIn(entry, input) : 'missing';
};

const unchanged = (depsDir, before) => JSON.stringify(readMetadata(depsDir)) === before;

/**
 * @param {ViteDepsInput} input the renderer deps folder Vite wrote and what it compared
 * @returns {Promise<'stored' | 'present' | 'not-ready' | 'skipped'>} not-ready: no metadata with these hashes yet
 */
const storeViteDeps = async (input) => {
  const { depsDir, installRoot, hashes } = input;
  const metadata = readMetadata(depsDir);
  if (!metadata || !matchesHashes(metadata, hashes) || !filesPresent(metadata, depsDir)) return 'not-ready';
  const id = idOf(input);
  const present = readEntry(id);
  if (present) {
    touchEntry(present);
    return 'present';
  }
  const before = JSON.stringify(metadata);
  try {
    await commitEntry({
      ...id,
      buildSettings: { layout: LAYOUT, lockfileHash: hashes.lockfileHash },
      fill: async (filesDir) => {
        await cp(depsDir, filesDir, { recursive: true });
        if (!unchanged(depsDir, before) || !unchanged(filesDir, before) || !filesPresent(metadata, filesDir)) throw new Error('build-cache: the dependency folder changed while it was copied');
        writeFileSync(join(filesDir, METADATA_FILE), `${JSON.stringify(portableMetadata(metadata, { depsDir, installRoot }), null, 2)}\n`);
      },
    });
    return 'stored';
  } catch {
    return 'skipped';
  }
};

/**
 * @param {ViteDepsInput} input the renderer deps folder and what Vite will compare
 * @returns {'present' | 'started' | 'skipped'} started: a process of its own waits for Vite, then stores
 */
const storeViteDepsDetached = (input) => {
  const id = idOf(input);
  const { dir } = entryPaths(id);
  if (started.has(dir)) return 'skipped';
  const present = readEntry(id, { verify: false });
  if (present) {
    touchEntry(present);
    return 'present';
  }
  started.add(dir);
  const child = spawn(process.execPath, [STORE_CLI, JSON.stringify({ ...input, root: id.root })], { detached: true, stdio: 'ignore', windowsHide: true, env: { ...process.env, [CACHE_ENV]: id.root } });
  child.unref();
  return 'started';
};

export { restoreViteDeps, storeViteDeps, storeViteDepsDetached };
export { hasViteDeps } from './deps-lookup.mjs';
export { storeRelativeOf } from './store-paths.mjs';
export { virtualStoreOf } from './virtual-store-of.mjs';
