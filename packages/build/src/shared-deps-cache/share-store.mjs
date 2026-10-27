/* @layer tooling-scripts @kind logic */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { dependencyVersions, readMetadata } from './deps-metadata.mjs';
import { DEPS_FOLDER, KEEP_ENTRIES, METADATA_FILE, SHARE_FILE, SHARE_VERSION, SHARED_CACHE_ENV, SHARED_CACHE_FOLDERS, STALE_TEMP_MS } from './shared-deps-cache.constants.mjs';
import { getHash } from './vite-hash.mjs';

/** @returns {string} the per-user folder for the shared caches */
const sharedCacheRoot = () => process.env[SHARED_CACHE_ENV] || join(homedir(), ...SHARED_CACHE_FOLDERS);

/**
 * @param {{ vite: string, lockfile: { content: string }, configHash: string }} parts what the cache depends on
 * @returns {string} the entry name two worktrees share
 */
const shareKey = ({ vite, lockfile, configHash }) => getHash(JSON.stringify({ version: SHARE_VERSION, vite, platform: `${process.platform}-${process.arch}`, lockfile: getHash(lockfile.content, 40), configHash }), 24);

const readShare = (entry) => {
  try {
    const share = JSON.parse(readFileSync(join(entry, SHARE_FILE), 'utf8'));
    return share?.version === SHARE_VERSION && share.versions && typeof share.versions === 'object' ? share : null;
  } catch {
    return null;
  }
};

const foldersOf = (root) => readdirSync(root, { withFileTypes: true })
  .filter((item) => item.isDirectory())
  .map((item) => ({ name: item.name, path: join(root, item.name), time: statSync(join(root, item.name)).mtimeMs }));

const prune = (root, keep) => {
  try {
    const folders = foldersOf(root);
    const partials = folders.filter((item) => item.name.endsWith('.tmp'));
    const entries = folders.filter((item) => !item.name.endsWith('.tmp')).sort((a, b) => b.time - a.time);
    for (const old of partials) if (Date.now() - old.time > STALE_TEMP_MS) rmSync(old.path, { recursive: true, force: true });
    for (const old of entries.slice(KEEP_ENTRIES)) if (old.path !== keep) rmSync(old.path, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
};

const touch = (path) => {
  try {
    const now = new Date();
    utimesSync(path, now, now);
    return true;
  } catch {
    return false;
  }
};

const copyIntoShare = (entry, depsDir, versions) => {
  const partial = `${entry}.${process.pid}.tmp`;
  try {
    mkdirSync(partial, { recursive: true });
    cpSync(depsDir, join(partial, DEPS_FOLDER), { recursive: true });
    writeFileSync(join(partial, SHARE_FILE), JSON.stringify({ version: SHARE_VERSION, versions }));
    renameSync(partial, entry);
    return true;
  } catch {
    rmSync(partial, { recursive: true, force: true });
    return false;
  }
};

const matchesHashes = (metadata, hashes) => metadata.lockfileHash === hashes.lockfileHash && metadata.configHash === hashes.configHash && metadata.hash === hashes.hash;

/**
 * @param {{ root: string, key: string, depsDir: string, store: string, hashes: { lockfileHash: string, configHash: string, hash: string } }} input
 * @returns {'published' | 'present' | 'skipped'} skipped when the cache is not shareable
 */
const publishDeps = ({ root, key, depsDir, store, hashes }) => {
  const metadata = readMetadata(depsDir);
  if (!metadata || !matchesHashes(metadata, hashes)) return 'skipped';
  const entry = join(root, key);
  if (existsSync(join(entry, SHARE_FILE))) {
    touch(entry);
    return 'present';
  }
  const versions = dependencyVersions(metadata, depsDir, store);
  if (!versions || !copyIntoShare(entry, depsDir, versions)) return 'skipped';
  prune(root, entry);
  return 'published';
};

const sameVersions = (stored, found) => Object.keys(stored).length === Object.keys(found).length && Object.entries(found).every(([id, version]) => stored[id] === version);

const copyFromShare = (shared, depsDir, metadata, hashes) => {
  const partial = `${depsDir}_seed_${process.pid}`;
  try {
    cpSync(shared, partial, { recursive: true });
    const next = { ...metadata, hash: hashes.hash, configHash: hashes.configHash, lockfileHash: hashes.lockfileHash };
    writeFileSync(join(partial, METADATA_FILE), JSON.stringify(next, null, 2));
    renameSync(partial, depsDir);
    return true;
  } catch {
    rmSync(partial, { recursive: true, force: true });
    return false;
  }
};

/**
 * @param {{ root: string, key: string, depsDir: string, store: string, hashes: { lockfileHash: string, configHash: string, hash: string } }} input
 * @returns {'seeded' | 'missing' | 'rejected'} rejected when a dependency is gone or at another version
 */
const seedDeps = ({ root, key, depsDir, store, hashes }) => {
  const entry = join(root, key);
  const share = readShare(entry);
  const shared = join(entry, DEPS_FOLDER);
  const metadata = readMetadata(shared);
  if (!share || !metadata) return 'missing';
  const versions = dependencyVersions(metadata, depsDir, store);
  if (!versions || !sameVersions(share.versions, versions)) return 'rejected';
  return copyFromShare(shared, depsDir, metadata, hashes) ? 'seeded' : 'rejected';
};

export { publishDeps, seedDeps, shareKey, sharedCacheRoot };
