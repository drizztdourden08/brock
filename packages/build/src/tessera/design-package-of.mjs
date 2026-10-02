/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DESIGN_DIR } from './tessera.constants.mjs';

/**
 * @param {string} rootDir  The repo root
 * @param {string} scope  Such as @acme
 * @returns {string | undefined}  the name of packages/design, if any
 */
const designPackageOf = (rootDir, scope) => {
  const file = join(rootDir, DESIGN_DIR, 'package.json');
  if (!existsSync(file)) return undefined;
  return JSON.parse(readFileSync(file, 'utf8')).name ?? `${scope}/design`;
};

export { designPackageOf };
