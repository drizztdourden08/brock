/* @layer tooling-scripts @kind logic */
import { contentStampOf, listingStampOf } from '../file-stamp.mjs';
import { placedStale } from '../placed-packages.mjs';

const firstOf = (table, differs) => Object.entries(table ?? {}).find(([name, key]) => differs(name, key))?.[0];

/**
 * @param {Pick<import('../module-keys.mjs').ModuleKeys, 'repo' | 'repoDirs' | 'placed' | 'files' | 'dirs'>} keys what a build recorded
 * @param {import('../repo-snapshot.mjs').RepoSnapshot} snapshot the checkout as it is now
 * @param {{ rootDir: string, root: string }} where the app root and the build cache root
 * @returns {string | null} the first file that no longer matches
 */
const firstStale = (keys, snapshot, { rootDir, root }) => {
  const file = firstOf(keys.repo, (rel, key) => snapshot.keyOf(rel) !== key);
  if (file !== undefined) return file;
  const folder = firstOf(keys.repoDirs, (rel, key) => snapshot.dirKeyOf(rel) !== key);
  if (folder !== undefined) return `${folder || '.'}/ (files added or removed)`;
  const placed = placedStale(keys.placed, rootDir, root);
  if (placed !== null) return `${placed} (compiled package)`;
  return firstOf(keys.files, (path, recorded) => recorded === null || contentStampOf(path) !== recorded) ?? firstOf(keys.dirs, (path, recorded) => recorded === null || listingStampOf(path) !== recorded) ?? null;
};

export { firstStale };
