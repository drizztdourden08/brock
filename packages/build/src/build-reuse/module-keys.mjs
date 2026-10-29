/* @layer tooling-scripts @kind logic */
import { dirname, isAbsolute, relative } from 'node:path';
import { moduleStamps } from './module-stamps.mjs';
import { stampOf } from './file-stamp.mjs';

const fileOf = (id) => id.replace(/[?#].*$/, '');

const inside = (root, file) => {
  if (!root) return false;
  const rel = relative(root, file);
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
};

/**
 * @typedef {object} ModuleKeys
 * @property {Record<string, string>} repo content keys of the files inside the repository
 * @property {Record<string, string>} repoDirs a key of the names in each of their folders
 * @property {Record<string, string | null>} files stamps of the other files outside node_modules
 * @property {Record<string, string | null>} dirs stamps of their folders
 */

/**
 * @param {Iterable<string>} ids the module ids a build read
 * @param {number} startedAt when the build began, in ms
 * @param {{ snapshot: import('./repo-snapshot.mjs').RepoSnapshot | null, packages?: string | null, stamp?: (file: string) => string | null, skipDirs?: string[] }} how packages is the package store
 * @returns {ModuleKeys} what the next start compares
 */
const moduleKeys = (ids, startedAt, { snapshot, packages = null, stamp = stampOf, skipDirs = [] }) => {
  const real = [...new Set([...ids].filter((id) => !id.startsWith('\0')).map(fileOf))].filter((file) => !inside(packages, file));
  const inRepo = new Set(snapshot ? real.filter((file) => snapshot.relOf(file) !== null) : []);
  const repo = {};
  const repoDirs = {};
  for (const file of inRepo) {
    const rel = snapshot.relOf(file);
    repo[rel] = snapshot.keyOf(rel);
    const dir = snapshot.relOf(dirname(file)) ?? '';
    repoDirs[dir] = snapshot.dirKeyOf(dir);
  }
  for (const dir of Object.keys(repoDirs)) {
    const manifest = snapshot.manifestOf(dir);
    if (manifest) repo[manifest] = snapshot.keyOf(manifest);
  }
  return { repo, repoDirs, ...moduleStamps(real.filter((file) => !inRepo.has(file)), startedAt, stamp, skipDirs) };
};

/**
 * @param {ModuleKeys} keys
 * @param {import('./repo-snapshot.mjs').RepoSnapshot | null} snapshot
 * @returns {boolean} true while every repository key still matches
 */
const repoKeysCurrent = (keys, snapshot) => {
  const files = Object.entries(keys.repo ?? {});
  const dirs = Object.entries(keys.repoDirs ?? {});
  if (files.length === 0 && dirs.length === 0) return true;
  if (!snapshot) return false;
  return files.every(([rel, key]) => snapshot.keyOf(rel) === key) && dirs.every(([rel, key]) => snapshot.dirKeyOf(rel) === key);
};

export { moduleKeys, repoKeysCurrent };
