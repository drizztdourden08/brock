/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';

/**
 * @param {string} installRoot the folder whose node_modules pnpm filled
 * @returns {string} the folder that holds the installed packages
 */
const virtualStoreOf = (installRoot) => {
  const modulesDir = join(installRoot, 'node_modules');
  try {
    const named = /^virtualStoreDir:\s*(.+)$/m.exec(readFileSync(join(modulesDir, '.modules.yaml'), 'utf8'))?.[1]?.trim().replace(/^(['"])(.*)\1$/, '$2');
    if (named) return isAbsolute(named) ? named : resolve(modulesDir, named);
  } catch {
    return join(modulesDir, '.pnpm');
  }
  return join(modulesDir, '.pnpm');
};

export { virtualStoreOf };
