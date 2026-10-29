/* @layer tooling-scripts @kind logic */
import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { STORE_LAYOUT, STORE_RECORD } from './clone.constants.mjs';
import { mirrorTree } from './mirror-tree.mjs';
import { isInside, pathMapper, textRewriter } from './path-map.mjs';
import { modulesStoreRoot } from './store-dir.mjs';

/**
 * @param {import('./modules-state.mjs').ModulesState} state
 * @returns {string} the store entry name: layout, platform, settings and the installed lockfile
 */
const storeKey = (state) => createHash('sha256')
  .update(JSON.stringify({ layout: STORE_LAYOUT, platform: process.platform, arch: process.arch, settings: state.settings }))
  .update(state.lockfile)
  .digest('hex')
  .slice(0, 24);

const readRecord = (dir) => {
  try {
    return JSON.parse(readFileSync(join(dir, STORE_RECORD), 'utf8'));
  } catch {
    return null;
  }
};

/**
 * @param {string} dir a store entry
 * @param {string} key
 * @returns {boolean} true when the entry was committed whole for this key
 */
const storeIsComplete = (dir, key) => {
  const record = readRecord(dir);
  return record?.layout === STORE_LAYOUT && record.key === key;
};

const HOISTED = `node_modules${sep}`;

/**
 * @param {{ source: string, virtualStore: string, dir: string }} where
 * @returns {import('./mirror-tree.mjs').MirrorRules} links into the store move with it; a hoisted workspace package is left out
 */
const storeRules = ({ source, virtualStore, dir }) => {
  const toStore = pathMapper([[virtualStore, dir]]);
  const shim = textRewriter([[virtualStore, dir]]);
  const keep = (text) => text;
  return {
    mapLink: (target, rel) => {
      if (isInside(virtualStore, target)) return toStore(target);
      if (!isInside(source, target)) return target;
      if (rel.startsWith(HOISTED)) return null;
      throw new Error(`${rel} in ${virtualStore} links into the checkout (${target}); it cannot be shared.`);
    },
    skip: (rel) => rel === STORE_RECORD,
    rewrite: (rel) => {
      if (!rel.includes(sep)) return keep;
      return rel.split(sep).includes('.bin') ? shim : null;
    },
  };
};

const commit = (partial, dir) => {
  try {
    renameSync(partial, dir);
  } catch (error) {
    rmSync(partial, { recursive: true, force: true });
    if (!existsSync(dir)) throw error;
  }
};

/**
 * Builds, once per installed lockfile, a shared copy of a checkout's virtual store that no install ever writes into.
 * @param {{ source: string, state: import('./modules-state.mjs').ModulesState, log: (message: string) => void }} input
 * @returns {Promise<string>} the store entry a clone links to
 */
const ensureVirtualStore = async ({ source, state, log }) => {
  const key = storeKey(state);
  if (storeIsComplete(state.virtualStore, key)) return state.virtualStore;
  const root = modulesStoreRoot(source);
  const dir = join(root, key);
  if (storeIsComplete(dir, key)) return dir;
  const partial = join(root, '.tmp', `${key}-${randomUUID()}`);
  mkdirSync(dirname(partial), { recursive: true });
  log(`Building the shared package store ${dir} from ${state.virtualStore} (once for this lockfile).`);
  const started = Date.now();
  try {
    const counts = await mirrorTree(state.virtualStore, partial, storeRules({ source, virtualStore: state.virtualStore, dir }));
    writeFileSync(join(partial, STORE_RECORD), JSON.stringify({ layout: STORE_LAYOUT, key, source, builtAt: new Date().toISOString(), counts }));
    commit(partial, dir);
    log(`Shared package store ready in ${Math.round((Date.now() - started) / 1000)} s: ${counts.linked} hardlinks, ${counts.copied} copies, ${counts.links} links.`);
    return dir;
  } catch (error) {
    rmSync(partial, { recursive: true, force: true });
    throw error;
  }
};

export { ensureVirtualStore, storeIsComplete, storeKey };
