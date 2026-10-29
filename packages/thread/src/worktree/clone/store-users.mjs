/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { mkdirSync, realpathSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { STORE_USERS } from './clone.constants.mjs';
import { entryOf } from './store-entry.mjs';

/**
 * @param {{ store: string, worktree: string, repo: string }} input the store, its user, its repo
 * @returns {string} the user record written, through a temp file and a rename
 */
const recordStoreUser = ({ store, worktree, repo }) => {
  const dir = join(entryOf(store), STORE_USERS);
  const real = realpathSync.native(worktree);
  const file = join(dir, `${createHash('sha1').update(real).digest('hex')}.json`);
  const partial = `${file}.${process.pid}.tmp`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(partial, JSON.stringify({ worktree: real, repo, createdAt: new Date().toISOString() }));
  renameSync(partial, file);
  return file;
};

export { recordStoreUser };
