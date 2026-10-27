/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { DIRTY_WINDOW_MS } from './build-reuse.constants.mjs';
import { stampOf } from './file-stamp.mjs';

const fileOf = (id) => id.replace(/[?#].*$/, '');

const realFilesOf = (ids) => [...new Set([...ids].filter((id) => !id.startsWith('\0') && isAbsolute(fileOf(id))).map(fileOf))];

const owningManifest = (file, cache) => {
  const dir = dirname(file);
  if (cache.has(dir)) return cache.get(dir);
  const manifest = join(dir, 'package.json');
  const parent = dirname(dir);
  let found = existsSync(manifest) ? manifest : null;
  if (!found && parent !== dir) found = owningManifest(dir, cache);
  cache.set(dir, found);
  return found;
};

const stampAt = (path, startedAt, stamp) => {
  const value = stamp(path);
  if (value === null) return undefined;
  return Number(value.split(':')[0]) >= startedAt - DIRTY_WINDOW_MS ? null : value;
};

const stampAll = (paths, startedAt, stamp) => {
  const stamps = {};
  for (const path of paths) {
    const value = stampAt(path, startedAt, stamp);
    if (value !== undefined) stamps[path] = value;
  }
  return stamps;
};

/**
 * @param {Iterable<string>} ids the module ids a build read
 * @param {number} startedAt when the build began, in ms
 * @param {(file: string) => string | null} [stamp] reads a file stamp
 * @param {string[]} [skipDirs] folders that change on every start
 * @returns {{ files: Record<string, string | null>, dirs: Record<string, string | null> }} stamps of modules, manifests and folders
 */
const moduleStamps = (ids, startedAt, stamp = stampOf, skipDirs = []) => {
  const files = realFilesOf(ids);
  const cache = new Map();
  const manifests = new Set(files.map((file) => owningManifest(file, cache)).filter(Boolean));
  return {
    files: stampAll([...files, ...manifests], startedAt, stamp),
    dirs: stampAll(new Set(files.map((file) => dirname(file)).filter((dir) => !skipDirs.some((skip) => resolve(skip) === resolve(dir)))), startedAt, stamp),
  };
};

export { moduleStamps };
