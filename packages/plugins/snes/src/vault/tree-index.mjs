/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { walkFiles } from '../walk-files.mjs';

const IGNORED = new Set(['.git', 'node_modules', '.DS_Store', 'Thumbs.db']);

const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

const posix = (path) => path.split('\\').join('/');

const indexUnder = (dir, prefix, into) => {
  walkFiles(dir, (file) => {
    into[`${prefix}${posix(relative(dir, file))}`] = sha256(file);
  }, IGNORED);
  return into;
};

/**
 * @param {string} dir
 * @returns {Record<string, string>} relative path to sha256
 */
const indexTree = (dir) => (existsSync(dir) && statSync(dir).isDirectory() ? indexUnder(dir, '', {}) : {});

/**
 * @param {string} root
 * @param {string[]} paths repo-relative files or directories
 * @returns {Record<string, string>} repo-relative path to sha256
 */
const indexPaths = (root, paths) => {
  const index = {};
  for (const path of paths) {
    const full = join(root, path);
    if (!existsSync(full)) continue;
    if (statSync(full).isDirectory()) indexUnder(full, `${path}/`, index);
    else index[path] = sha256(full);
  }
  return index;
};

export { indexPaths, indexTree };
