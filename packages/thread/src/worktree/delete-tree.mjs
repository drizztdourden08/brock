/* @layer tooling-scripts @kind logic */
import { realpathSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

const RETRIES = 5;
const RETRY_DELAY_MS = 200;

const isInside = (root, target) => {
  const rel = relative(root, target);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
};

const GONE = new Set(['ENOENT', 'ENOTDIR']);

const realFolderOf = (path) => {
  try {
    return realpathSync(path);
  } catch (error) {
    if (GONE.has(error?.code)) return null;
    throw error;
  }
};

const assertInside = (root, target) => {
  if (dirname(resolve(root)) === resolve(root)) throw new Error(`Refusing to delete under a filesystem root: ${root}`);
  if (!isInside(resolve(root), resolve(target))) throw new Error(`Refusing to delete ${target}: it is outside ${root}.`);
  if (resolve(root) === resolve(target)) return true;
  const realRoot = realFolderOf(root);
  const realParent = realFolderOf(dirname(resolve(target)));
  if (realRoot === null || realParent === null) return false;
  if (!isInside(realRoot, realParent)) throw new Error(`Refusing to delete ${target}: its folder resolves outside ${root}.`);
  return true;
};

/**
 * @param {string} root the worktree folder, the limit of any delete
 * @param {string} target the absolute path to delete, root included
 * @returns {Promise<{ path: string, code: string } | null>} null when it is gone, else why it survived
 */
const deleteTree = async (root, target) => {
  if (!assertInside(root, target)) return null;
  try {
    await rm(resolve(target), { recursive: true, force: true, maxRetries: RETRIES, retryDelay: RETRY_DELAY_MS });
    return null;
  } catch (error) {
    if (GONE.has(error?.code)) return null;
    return { path: target, code: error?.code ?? 'UNKNOWN' };
  }
};

export { deleteTree };
