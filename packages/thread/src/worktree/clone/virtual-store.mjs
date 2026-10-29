/* @layer tooling-scripts @kind logic */
import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { deleteTree } from '../delete-tree.mjs';
import { STORE_LAYOUT, STORE_RECORD } from './clone.constants.mjs';
import { mirrorTree } from './mirror-tree.mjs';
import { modulesState } from './modules-state.mjs';
import { isInside, pathMapper, textRewriter } from './path-map.mjs';
import { modulesStoreRoot } from './store-dir.mjs';
import { describeStore, entriesFor, entryOf, findStore, PACKAGES, storeIsComplete } from './store-entry.mjs';

/**
 * @param {import('./modules-state.mjs').ModulesState} state
 * @returns {string} the store entry name
 */
const storeKey = (state) => createHash('sha256')
  .update(JSON.stringify({ layout: STORE_LAYOUT, platform: process.platform, arch: process.arch, settings: state.settings }))
  .update(state.lockfile)
  .digest('hex')
  .slice(0, 24);

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
      if (isInside(source, target) && rel.startsWith(HOISTED)) return null;
      throw new Error(`${rel} in ${virtualStore} links to ${target}, outside the store; it cannot be shared.`);
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
    mapLink: (target, rel) => {
      if (isInside(virtualStore, target)) return toStore(target);
      if (isInside(source, target)) return null;
      throw new Error(`node_modules/${rel} in ${source} links to ${target}, outside the store; it cannot be shared.`);
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

const buildStore = async ({ source, state, entry, partial }) => {
  const dir = join(entry, ...PACKAGES);
  const where = { source, virtualStore: state.virtualStore, dir };
  const counts = await mirrorTree(state.virtualStore, join(partial, ...PACKAGES), storeRules(where));
  await mirrorTree(join(source, 'node_modules'), join(partial, 'node_modules'), rootRules(where));
  return counts;
};

const assertSourceUnchanged = (source, key) => {
  const after = modulesState(source);
  if (!after || storeKey(after) !== key) throw new Error(`${source} was installed again while its store was copied; the copy is dropped.`);
};

const reusableStore = ({ source, state, key, root, log }) => {
  const own = entryOf(state.virtualStore);
  if (existsSync(join(own, STORE_RECORD))) {
    if (!storeIsComplete(own, key)) throw new Error(`the shared store behind ${source} (${own}) is damaged.`);
    return state.virtualStore;
  }
  const found = findStore(root, key);
  if (found) return join(found, ...PACKAGES);
  const damaged = entriesFor(root, key).map((item) => item.dir);
  if (damaged.length > 0) log(`The shared store ${damaged[0]} is damaged and stays where it is; building a new one next to it.`);
  return null;
};

/**
 * @param {{ source: string, state: import('./modules-state.mjs').ModulesState, log: (message: string) => void, mains: string[] }} input
 * @returns {Promise<string>} the package folder a clone links to
 */
const ensureVirtualStore = async ({ source, state, log, mains }) => {
  const key = storeKey(state);
  const root = modulesStoreRoot(source);
  const reused = reusableStore({ source, state, key, root, log });
  if (reused) return reused;
  const entry = join(root, `${key}-${randomUUID().slice(0, 8)}`);
  const partial = join(root, '.tmp', `${key}-${randomUUID()}`);
  mkdirSync(dirname(partial), { recursive: true });
  log(`Building the shared package store ${entry} from ${state.virtualStore} (once for this lockfile).`);
  const started = Date.now();
  try {
    const counts = await buildStore({ source, state, entry, partial });
    assertSourceUnchanged(source, key);
    const manifest = describeStore(partial);
    writeFileSync(join(partial, STORE_RECORD), JSON.stringify({ layout: STORE_LAYOUT, key, source, builtAt: new Date().toISOString(), counts, manifest }));
    renameSync(partial, entry);
    log(`Shared package store ready in ${Math.round((Date.now() - started) / 1000)} s: ${counts.linked} hardlinks, ${counts.copied} copies, ${counts.links} links.`);
    return join(entry, ...PACKAGES);
  } catch (error) {
    await discard({ root, partial, mains, log });
    throw error;
  }
};

export { ensureVirtualStore };
