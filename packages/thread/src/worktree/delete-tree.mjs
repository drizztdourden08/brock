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

const assertInside = (root, target) => {
  if (dirname(resolve(root)) === resolve(root)) throw new Error(`Refusing to delete under a filesystem root: ${root}`);
  if (!isInside(resolve(root), resolve(target))) throw new Error(`Refusing to delete ${target}: it is outside ${root}.`);
  if (resolve(root) === resolve(target)) return;
  if (!isInside(realpathSync(root), realpathSync(dirname(resolve(target))))) {
    throw new Error(`Refusing to delete ${target}: its folder resolves outside ${root}.`);
  }
};

/**
 * @param {string} root the worktree folder, the limit of any delete
 * @param {string} target the absolute path to delete, root included
 * @returns {Promise<{ path: string, code: string } | null>} null when it is gone, else why it survived
 */
const deleteTree = async (root, target) => {
  assertInside(root, target);
  try {
    await rm(resolve(target), { recursive: true, force: true, maxRetries: RETRIES, retryDelay: RETRY_DELAY_MS });
    return null;
  } catch (error) {
    return { path: target, code: error?.code ?? 'UNKNOWN' };
  }
};

export { deleteTree };
