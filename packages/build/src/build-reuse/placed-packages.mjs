/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';
import { cacheRoot } from '@drizztdourden08/build-cache/store';
import { PLACED_FOLDER, PLACED_MARKER } from './build-reuse.constants.mjs';

const SEGMENT = `/${PLACED_FOLDER.join('/')}/`;

const posix = (path) => path.split(String.fromCharCode(92)).join('/');

const readJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

const packageOf = (file) => {
  const path = posix(file);
  const at = path.indexOf(SEGMENT);
  if (at < 0) return null;
  const parts = path.slice(at + SEGMENT.length).split('/');
  const count = parts[0].startsWith('@') ? 2 : 1;
  if (parts.length <= count) return null;
  const name = parts.slice(0, count).join('/');
  return { name, dir: `${path.slice(0, at + SEGMENT.length)}${name}` };
};

const entryFolder = (root, from) => {
  if (!from) return null;
  const rel = relative(root, from);
  return rel === '' || rel.startsWith('..') || isAbsolute(rel) ? null : posix(rel);
};

/**
 * @param {string[]} files module files a build read
 * @param {string} [root] the build cache root
 * @returns {{ placed: Record<string, { contentHash: string, from: string | null }>, rest: string[] }} compiled packages by name
 */
const placedOf = (files, root = cacheRoot()) => {
  const placed = {};
  const rest = [];
  const markers = new Map();
  for (const file of files) {
    const pkg = packageOf(file);
    if (pkg && !markers.has(pkg.dir)) markers.set(pkg.dir, readJson(join(pkg.dir, PLACED_MARKER)));
    const marker = pkg ? markers.get(pkg.dir) : null;
    if (marker?.contentHash) placed[pkg.name] = { contentHash: marker.contentHash, from: entryFolder(root, marker.from) };
    else rest.push(file);
  }
  return { placed, rest };
};

const isCurrent = (name, record, rootDir, root) => {
  const local = readJson(join(rootDir, ...PLACED_FOLDER, ...name.split('/'), PLACED_MARKER));
  if (local) return local.contentHash === record.contentHash;
  if (!record.from || record.from.split('/').includes('..')) return false;
  return readJson(join(root, ...record.from.split('/'), 'manifest.json'))?.contentHash === record.contentHash;
};

/**
 * @param {Record<string, { contentHash: string, from: string | null }> | undefined} placed what a build recorded
 * @param {string} rootDir the app root
 * @param {string} [root] the build cache root
 * @returns {string | null} the first package whose copy differs
 */
const placedStale = (placed, rootDir, root = cacheRoot()) => Object.entries(placed ?? {}).find(([name, record]) => !isCurrent(name, record, rootDir, root))?.[0] ?? null;

export { placedOf, placedStale };
