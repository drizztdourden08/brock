/* @layer tooling-scripts @kind logic */
import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { deleteTree } from '../delete-tree.mjs';
import { STORE_LAYOUT, STORE_RECORD } from './clone.constants.mjs';
import { mirrorTree } from './mirror-tree.mjs';
import { isInside, pathMapper, textRewriter } from './path-map.mjs';
import { modulesStoreRoot } from './store-dir.mjs';

/**
 * @param {import('./modules-state.mjs').ModulesState} state
 * @returns {string} the store entry name
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
 * @returns {import('./mirror-tree.mjs').MirrorRules} links into the store move with it
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

/**
 * @param {{ source: string, virtualStore: string, dir: string }} where
 * @returns {import('./mirror-tree.mjs').MirrorRules} the root node_modules a package finds above the store
 */
const rootRules = ({ source, virtualStore, dir }) => {
  const toStore = pathMapper([[virtualStore, dir]]);
  return {
    mapLink: (target) => {
      if (isInside(virtualStore, target)) return toStore(target);
      return isInside(source, target) ? null : target;
    },
    skip: (rel) => !rel.includes(sep) && rel.startsWith('.'),
  };
};

/**
 * @param {{ root: string, partial: string, mains: string[], log: (message: string) => void }} input
 * @returns {Promise<void>} the half copy is gone, links removed as links
 */
const discard = async ({ root, partial, mains, log }) => {
  try {
    const failure = await deleteTree({ owner: root, target: partial, mains });
    if (failure) log(`The unfinished store copy ${failure.path} stayed (${failure.code}); it is safe to remove later.`);
  } catch (error) {
    log(`The unfinished store copy ${partial} stayed: ${error?.message ?? error}`);
  }
};

const commit = async ({ root, partial, dir, mains, log }) => {
  try {
    renameSync(partial, dir);
  } catch (error) {
    await discard({ root, partial, mains, log });
    if (!existsSync(dir)) throw error;
  }
};

const PACKAGES = ['node_modules', '.pnpm'];

const entryOf = (virtualStore) => dirname(dirname(virtualStore));

const buildStore = async ({ source, state, entry, partial }) => {
  const dir = join(entry, ...PACKAGES);
  const where = { source, virtualStore: state.virtualStore, dir };
  const counts = await mirrorTree(state.virtualStore, join(partial, ...PACKAGES), storeRules(where));
  await mirrorTree(join(source, 'node_modules'), join(partial, 'node_modules'), rootRules(where));
  return counts;
};

/**
 * @param {{ source: string, state: import('./modules-state.mjs').ModulesState, log: (message: string) => void, mains: string[] }} input
 * @returns {Promise<string>} the package folder a clone links to
 */
const ensureVirtualStore = async ({ source, state, log, mains }) => {
  const key = storeKey(state);
  if (storeIsComplete(entryOf(state.virtualStore), key)) return state.virtualStore;
  const root = modulesStoreRoot(source);
  const entry = join(root, key);
  if (storeIsComplete(entry, key)) return join(entry, ...PACKAGES);
  const partial = join(root, '.tmp', `${key}-${randomUUID()}`);
  mkdirSync(dirname(partial), { recursive: true });
  log(`Building the shared package store ${entry} from ${state.virtualStore} (once for this lockfile).`);
  const started = Date.now();
  try {
    const counts = await buildStore({ source, state, entry, partial });
    writeFileSync(join(partial, STORE_RECORD), JSON.stringify({ layout: STORE_LAYOUT, key, source, builtAt: new Date().toISOString(), counts }));
    await commit({ root, partial, dir: entry, mains, log });
    log(`Shared package store ready in ${Math.round((Date.now() - started) / 1000)} s: ${counts.linked} hardlinks, ${counts.copied} copies, ${counts.links} links.`);
    return join(entry, ...PACKAGES);
  } catch (error) {
    await discard({ root, partial, mains, log });
    throw error;
  }
};

export { ensureVirtualStore };
