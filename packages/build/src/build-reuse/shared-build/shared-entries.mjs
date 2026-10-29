/* @layer tooling-scripts @kind logic */
import { readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { entryPaths, hashValue, KIND } from '@drizztdourden08/build-cache/store';
import { KEY_LENGTH, MAX_VARIANTS } from './shared-build.constants.mjs';

/**
 * @typedef {{ root: string, identity: import('./env-key.mjs').AppIdentity, target: string, envKey: string }} EntryScope the cache root and what an entry is for
 */

const prefixOf = ({ target, envKey }) => `${target}-${process.platform}-${process.arch}-${envKey.slice(0, KEY_LENGTH)}-`;

const idWith = ({ root, identity }, buildKey) => ({ root, kind: KIND.APP_BUILD, name: identity.name, version: identity.version, buildKey });

/**
 * @param {EntryScope} scope
 * @param {Pick<import('../module-keys.mjs').ModuleKeys, 'repo' | 'repoDirs' | 'placed' | 'files' | 'dirs'>} keys the sources the build read
 * @returns {import('@drizztdourden08/build-cache/store').EntryId} the entry for exactly these sources
 */
const entryIdFor = (scope, keys) => idWith(scope, `${prefixOf(scope)}${hashValue({ repo: keys.repo, repoDirs: keys.repoDirs, placed: keys.placed, files: keys.files, dirs: keys.dirs })}`);

/**
 * @param {EntryScope} scope
 * @returns {import('@drizztdourden08/build-cache/store').EntryId[]} the newest entries of this app and environment, any sources
 */
const variantIds = (scope) => {
  const folder = dirname(entryPaths(idWith(scope, 'x')).dir);
  const prefix = prefixOf(scope);
  try {
    return readdirSync(folder, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
      .map((entry) => ({ name: entry.name, at: statSync(join(folder, entry.name)).mtimeMs }))
      .sort((a, b) => b.at - a.at)
      .slice(0, MAX_VARIANTS)
      .map((entry) => idWith(scope, entry.name));
  } catch {
    return [];
  }
};

export { entryIdFor, variantIds };
