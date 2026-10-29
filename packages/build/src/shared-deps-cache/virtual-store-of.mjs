/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';

/**
 * pnpm keeps packages in node_modules/.pnpm, or wherever .modules.yaml says, as in a worktree whose packages are shared.
 * @param {string} lockfilePath the installed lockfile, <root>/node_modules/.pnpm/lock.yaml
 * @returns {string} the folder that holds the installed packages
 */
const virtualStoreOf = (lockfilePath) => {
  const modulesDir = dirname(dirname(lockfilePath));
  try {
    const named = /^virtualStoreDir:\s*(.+)$/m.exec(readFileSync(join(modulesDir, '.modules.yaml'), 'utf8'))?.[1]?.trim().replace(/^(['"])(.*)\1$/, '$2');
    if (named) return isAbsolute(named) ? named : resolve(modulesDir, named);
  } catch {
    return dirname(lockfilePath);
  }
  return dirname(lockfilePath);
};

export { virtualStoreOf };
