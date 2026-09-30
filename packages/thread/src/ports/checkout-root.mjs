/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

/**
 * @param {string} dir any folder inside a checkout
 * @returns {string | null} the nearest folder holding .git, a file in a worktree
 */
const checkoutRoot = (dir) => {
  for (let current = resolve(dir); ; current = dirname(current)) {
    if (existsSync(join(current, '.git'))) return current;
    if (dirname(current) === current) return null;
  }
};

export { checkoutRoot };
