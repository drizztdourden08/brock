/* @layer tooling-scripts @kind logic */
import { stampOf } from '../file-stamp.mjs';

const firstOf = (table, differs) => Object.entries(table ?? {}).find(([name, key]) => differs(name, key))?.[0];

/**
 * @param {Pick<import('../module-keys.mjs').ModuleKeys, 'repo' | 'repoDirs' | 'files' | 'dirs'>} keys what a build recorded
 * @param {import('../repo-snapshot.mjs').RepoSnapshot} snapshot the checkout as it is now
 * @returns {string | null} the first file that no longer matches
 */
const firstStale = (keys, snapshot) => {
  const file = firstOf(keys.repo, (rel, key) => snapshot.keyOf(rel) !== key);
  if (file !== undefined) return file;
  const folder = firstOf(keys.repoDirs, (rel, key) => snapshot.dirKeyOf(rel) !== key);
  if (folder !== undefined) return `${folder || '.'}/ (files added or removed)`;
  return firstOf({ ...keys.files, ...keys.dirs }, (path, recorded) => recorded === null || stampOf(path) !== recorded) ?? null;
};

export { firstStale };
