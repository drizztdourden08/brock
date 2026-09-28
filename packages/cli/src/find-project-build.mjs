/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const BUILD_DIR = join('node_modules', '@drizztdourden08', 'brock-build');

/**
 * @typedef {object} ProjectBuild
 * @property {string} root the folder whose node_modules holds it
 * @property {string} bin
 * @property {string} version
 */

/**
 * @param {string} cwd
 * @returns {ProjectBuild | null} the nearest brock-build a project installed
 */
const findProjectBuild = (cwd) => {
  for (let dir = resolve(cwd); ; dir = dirname(dir)) {
    const bin = join(dir, BUILD_DIR, 'bin', 'brock.mjs');
    if (existsSync(bin)) {
      const { version } = JSON.parse(readFileSync(join(dir, BUILD_DIR, 'package.json'), 'utf8'));
      return { root: dir, bin, version };
    }
    if (dirname(dir) === dir) return null;
  }
};

export { findProjectBuild };
