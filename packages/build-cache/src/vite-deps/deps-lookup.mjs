/* @layer tooling-scripts @kind logic */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { cacheRoot } from '../store/cache-root.mjs';
import { entryPaths } from '../store/entry-path.mjs';
import { KIND, MANIFEST_FILE } from '../store/store.constants.mjs';
import { ENTRY_NAME, LAYOUT } from './vite-deps.constants.mjs';

const carries = (file, lockfileHash) => {
  try {
    const settings = JSON.parse(readFileSync(file, 'utf8')).buildSettings;
    return settings?.layout === LAYOUT && settings.lockfileHash === lockfileHash;
  } catch {
    return false;
  }
};

/**
 * @param {{ version: string, lockfileHash: string, root?: string }} input the Vite version and Vite's hash of the lockfile
 * @returns {boolean} some key holds a pre-bundle for them; the files are not read
 */
const hasViteDeps = ({ version, lockfileHash, root = cacheRoot() }) => {
  const folder = dirname(entryPaths({ root, kind: KIND.VITE_DEPS, name: ENTRY_NAME, version, buildKey: 'any' }).dir);
  try {
    return readdirSync(folder).some((name) => carries(join(folder, name, MANIFEST_FILE), lockfileHash));
  } catch {
    return false;
  }
};

export { hasViteDeps };
