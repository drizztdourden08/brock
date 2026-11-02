/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} dir
 * @returns {Record<string, any> | null} the package.json of the folder, null when it is missing or unreadable
 */
const readAppPackage = (dir) => {
  try {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  } catch {
    return null;
  }
};

/**
 * @param {Record<string, any> | null} pkg
 * @returns {Record<string, string>} every declared dependency and its spec
 */
const declaredSpecs = (pkg) => ({
  ...pkg?.peerDependencies,
  ...pkg?.optionalDependencies,
  ...pkg?.devDependencies,
  ...pkg?.dependencies,
});

export { declaredSpecs, readAppPackage };
