/* @layer tooling-scripts @kind logic */
import { hasViteDeps } from '@drizztdourden08/build-cache/vite-deps';
import { lockfileKeyText, viteVersionOf } from './share-deps.mjs';
import { getHash, lockfileOf } from './vite-hash.mjs';

/**
 * @param {string} rootDir the app root
 * @param {string} [root] the cache root
 * @returns {boolean} an entry for this Vite and lockfile; no Vite load
 */
const lockfileEntryExists = (rootDir, root) => {
  const version = viteVersionOf(rootDir);
  const lockfile = lockfileOf(rootDir);
  return Boolean(version && lockfile && hasViteDeps({ version, lockfileHash: getHash(lockfileKeyText(lockfile)), root }));
};

export { lockfileEntryExists };
