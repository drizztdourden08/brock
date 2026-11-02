/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

/**
 * @typedef {object} InstalledPackage
 * @property {string} root the folder whose node_modules holds it
 * @property {string} bin
 * @property {string} version
 */

/**
 * @param {string} cwd
 * @param {string} packageName
 * @param {string} binFile the file under the package bin folder
 * @returns {InstalledPackage | null} the nearest copy a project installed
 */
const findInstalled = (cwd, packageName, binFile) => {
  const packageDir = join('node_modules', ...packageName.split('/'));
  for (let dir = resolve(cwd); ; dir = dirname(dir)) {
    const bin = join(dir, packageDir, 'bin', binFile);
    if (existsSync(bin)) {
      const { version } = JSON.parse(readFileSync(join(dir, packageDir, 'package.json'), 'utf8'));
      return { root: dir, bin, version };
    }
    if (dirname(dir) === dir) return null;
  }
};

export { findInstalled };
