/* @layer tooling-scripts @kind logic */
import { realpathSync } from 'node:fs';
import { isAbsolute, join, relative, sep } from 'node:path';
import { virtualStoreOf } from './virtual-store-of.mjs';

const realOrSelf = (path) => {
  try {
    return realpathSync(path);
  } catch {
    return path;
  }
};

/**
 * @param {string} root a folder
 * @param {string} path a path
 * @returns {string | null} the path below it, null when outside
 */
const below = (root, path) => {
  const rel = relative(root, path);
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel) ? rel.split(sep).join('/') : null;
};

/**
 * @param {string} installRoot the folder whose node_modules pnpm filled
 * @returns {(path: string) => string | null} the path below the store, null outside
 */
const storeRelativeOf = (installRoot) => {
  const named = virtualStoreOf(installRoot);
  const own = join(installRoot, 'node_modules', '.pnpm');
  const roots = [...new Set([named, realOrSelf(named), own, realOrSelf(own)])];
  return (path) => roots.map((root) => below(root, path)).find((found) => found !== null) ?? null;
};

export { below, storeRelativeOf };
