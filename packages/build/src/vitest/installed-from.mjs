/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * @param {string} dir the folder to look from
 * @param {string} name a package name
 * @returns {boolean} whether a node_modules at or above dir has it
 */
const installedFrom = (dir, name) => {
  if (existsSync(join(dir, 'node_modules', ...name.split('/'), 'package.json'))) return true;
  const parent = dirname(dir);
  return parent !== dir && installedFrom(parent, name);
};

export { installedFrom };
