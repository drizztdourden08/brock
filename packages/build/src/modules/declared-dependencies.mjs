/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} rootDir
 * @returns {string[]} the dependencies and devDependencies package.json names
 */
const declaredDependencies = (rootDir) => {
  try {
    const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
    return Object.keys({ ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) });
  } catch {
    return [];
  }
};

export { declaredDependencies };
