/* @layer tooling-scripts @kind logic */
import { realpathSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { removeLink, removeLinksFirst, statOf } from './links-first.mjs';
import { samePath } from './same-path.mjs';

const RETRIES = 5;
const RETRY_DELAY_MS = 200;
const GONE = new Set(['ENOENT', 'ENOTDIR']);

/**
 * @param {string} root
 * @param {string} target
 * @returns {boolean} true when target sits below root, never root itself
 */
const isStrictlyInside = (root, target) => {
  const rel = relative(root, target);
  return rel !== '' && rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
};

const realOf = (path) => realpathSync.native(path);

const assertOwned = (owner, target, isLink) => {
  if (dirname(owner) === owner) throw new Error(`Refusing to delete under a filesystem root: ${owner}.`);
  if (!isStrictlyInside(owner, target)) throw new Error(`Refusing to delete ${target}: it is not inside ${owner}, the folder this delete owns.`);
  const realOwner = realOf(owner);
  const realParent = realOf(dirname(target));
  if (!samePath(realOwner, realParent) && !isStrictlyInside(realOwner, realParent)) throw new Error(`Refusing to delete ${target}: its folder resolves outside ${realOwner}, to ${realParent}.`);
  if (!isLink && !isStrictlyInside(realOwner, realOf(target))) throw new Error(`Refusing to delete ${target}: it resolves outside ${realOwner}.`);
};

const assertNotCheckout = (target, mains) => {
  const main = mains.find((path) => samePath(path, target) || isStrictlyInside(target, resolve(path)));
  if (main) throw new Error(`Refusing to delete ${target}: it is or holds the main checkout ${main}.`);
  if (statOf(join(target, '.git'))?.isDirectory()) throw new Error(`Refusing to delete ${target}: it holds a .git folder, so it is a repository, not a worktree or a leftover.`);
};

/**
 * @param {{ owner: string, target: string, mains?: string[] }} request owner bounds the delete
 * @returns {Promise<{ path: string, code: string } | null>} null when gone, else why it stayed
 */
const deleteTree = async ({ owner, target, mains = [] }) => {
  const root = resolve(owner);
  const full = resolve(target);
  if (!isStrictlyInside(root, full)) throw new Error(`Refusing to delete ${full}: it is not inside ${root}, the folder this delete owns.`);
  const stat = statOf(full);
  if (!stat) return null;
  assertOwned(root, full, stat.isSymbolicLink());
  if (stat.isSymbolicLink()) {
    removeLink(full);
    return null;
  }
  assertNotCheckout(full, mains);
  removeLinksFirst(full);
  try {
    await rm(full, { recursive: true, force: true, maxRetries: RETRIES, retryDelay: RETRY_DELAY_MS });
    return null;
  } catch (error) {
    if (GONE.has(error?.code)) return null;
    return { path: full, code: error?.code ?? 'UNKNOWN' };
  }
};

export { assertNotCheckout, deleteTree, isStrictlyInside };
