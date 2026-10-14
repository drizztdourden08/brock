/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const GITDIR_LINE = /^gitdir:\s*(.+)$/m;
const GIT_ENTRY = '.git';

const gitTopOf = (dir) => {
  for (let current = resolve(dir); ; current = dirname(current)) {
    if (existsSync(join(current, GIT_ENTRY))) return current;
    if (dirname(current) === current) return null;
  }
};

const commonDirOf = (gitDir) => {
  const file = join(gitDir, 'commondir');
  return existsSync(file) ? resolve(gitDir, readFileSync(file, 'utf8').trim()) : resolve(gitDir, '..', '..');
};

/**
 * @param {string} dir a folder inside a git checkout
 * @returns {{ top: string, main: string } | null} worktree top and main checkout, else null
 */
const mainCheckoutOf = (dir) => {
  const top = gitTopOf(dir);
  if (!top || !statSync(join(top, GIT_ENTRY)).isFile()) return null;
  const gitDir = GITDIR_LINE.exec(readFileSync(join(top, GIT_ENTRY), 'utf8'))?.[1]?.trim();
  if (!gitDir) return null;
  const main = dirname(commonDirOf(resolve(top, gitDir)));
  return main === top ? null : { top, main };
};

export { mainCheckoutOf };
