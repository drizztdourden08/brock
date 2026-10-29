/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { cacheRoot, entryPaths, KIND } from '@drizztdourden08/build-cache/store';
import { ENTRY_NAME } from './shared-deps-cache.constants.mjs';
import { viteVersionOf } from './share-deps.mjs';

/**
 * @param {string} rootDir the app root
 * @param {string} [root] the cache root
 * @returns {boolean} a pre-bundle for this Vite version exists
 */
const depsEntryExists = (rootDir, root = cacheRoot()) => {
  const version = viteVersionOf(rootDir);
  if (!version) return false;
  const folder = dirname(entryPaths({ root, kind: KIND.VITE_DEPS, name: ENTRY_NAME, version, buildKey: 'x' }).dir);
  try {
    return readdirSync(folder).some((name) => existsSync(join(folder, name, 'manifest.json')));
  } catch {
    return false;
  }
};

export { depsEntryExists };
