/* @layer tooling-scripts @kind logic */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { git } from '../git.mjs';

/**
 * @param {string} main the main checkout
 * @param {string} worktreesDir relative to the main checkout
 * @returns {boolean} true when the entry was added
 */
const excludeWorktrees = (main, worktreesDir) => {
  const gitDir = resolve(main, git(['rev-parse', '--git-common-dir'], main));
  const file = join(gitDir, 'info', 'exclude');
  const entry = `/${worktreesDir.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')}/`;
  const current = existsSync(file) ? readFileSync(file, 'utf8') : '';
  if (current.split(/\r?\n/).includes(entry)) return false;
  mkdirSync(join(gitDir, 'info'), { recursive: true });
  appendFileSync(file, `${current && !current.endsWith('\n') ? '\n' : ''}${entry}\n`);
  return true;
};

export { excludeWorktrees };
