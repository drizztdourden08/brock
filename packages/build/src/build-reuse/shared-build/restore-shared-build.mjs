/* @layer tooling-scripts @kind logic */
import { cacheRoot, readEntry } from '@drizztdourden08/build-cache/store';
import { repoSnapshot } from '../repo-snapshot.mjs';
import { readStore, storeFile, storeIsCurrent } from '../reuse-store.mjs';
import { applyEntry } from './apply-entry.mjs';
import { identityOf, sharedEnvKey } from './env-key.mjs';
import { SHARED_TARGETS } from './shared-build.constants.mjs';
import { variantIds } from './shared-entries.mjs';
import { firstStale } from './stale-file.mjs';

const NO_ENTRY = 'no entry in the build cache';

const findCurrent = (scope, snapshot, rootDir) => {
  let reason = NO_ENTRY;
  let first = true;
  for (const id of variantIds(scope)) {
    const entry = readEntry(id, { verify: false });
    if (!entry) continue;
    const stale = firstStale(entry.manifest, snapshot, { rootDir, root: scope.root });
    if (stale === null) {
      const verified = readEntry(id);
      if (verified) return { entry: verified };
      reason = 'entry damaged';
    } else if (first) {
      reason = `changed file ${stale}`;
    }
    first = false;
  }
  return { reason };
};

const localIsCurrent = (rootDir, target, envKey, snapshot) => {
  const store = readStore(storeFile(rootDir, target));
  return store?.preflight === envKey && storeIsCurrent(store, store.key, { snapshot, rootDir });
};

const restoreTarget = ({ rootDir, target, snapshot, root }) => {
  const identity = identityOf(rootDir, snapshot);
  const envKey = sharedEnvKey(rootDir, target, identity);
  if (localIsCurrent(rootDir, target, envKey, snapshot)) return { target, status: 'local' };
  const { entry, reason } = findCurrent({ root, identity, target, envKey }, snapshot, rootDir);
  if (!entry) return { target, status: 'miss', reason };
  applyEntry({ entry, rootDir, target });
  return { target, status: 'cache' };
};

const attempt = (input) => {
  if (!input.snapshot) return { target: input.target, status: 'miss', reason: 'not a git checkout' };
  try {
    return restoreTarget(input);
  } catch (error) {
    return { target: input.target, status: 'miss', reason: error?.message ?? String(error) };
  }
};

const hitLine = (results, ms) => {
  const from = results.every((item) => item.status === 'local') ? 'this worktree' : 'the build cache';
  return `reused the ${results.map((item) => item.target).join(' and ')} ${results.length > 1 ? 'builds' : 'build'} from ${from} in ${ms} ms, Vite not loaded.`;
};

const missLine = (results, ms) => {
  const missed = results.filter((item) => item.status === 'miss').map((item) => `${item.target}: ${item.reason}`);
  return `no shared build to reuse (${missed.join('; ')}); checked in ${ms} ms.`;
};

/**
 * @typedef {object} SharedRestore
 * @property {boolean} hit every bundle was reused
 * @property {string[]} missed the bundles that still need a build
 * @property {number} ms time spent
 */

/**
 * @param {string} rootDir the app root
 * @param {{ log?: (line: string) => void, targets?: string[], root?: string }} [options] where to say what happened
 * @returns {SharedRestore} reads git and the build cache only; Vite is never loaded
 */
const restoreSharedBuild = (rootDir, { log = () => undefined, targets = SHARED_TARGETS, root = cacheRoot() } = {}) => {
  const started = Date.now();
  const snapshot = repoSnapshot(rootDir);
  const results = targets.map((target) => attempt({ rootDir, target, snapshot, root }));
  const missed = results.filter((item) => item.status === 'miss').map((item) => item.target);
  const ms = Date.now() - started;
  log(missed.length === 0 ? hitLine(results, ms) : missLine(results, ms));
  return { hit: missed.length === 0, missed, ms };
};

export { restoreSharedBuild };
