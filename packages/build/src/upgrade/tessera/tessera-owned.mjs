/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { TESSERA_IMPORT } from './tessera-renames.constants.mjs';

const owners = new Map();

const packageNameIn = (dir) => {
  const file = join(dir, 'package.json');
  if (!existsSync(file)) return undefined;
  try {
    return String(JSON.parse(readFileSync(file, 'utf8')).name ?? '');
  } catch {
    return '';
  }
};

/**
 * @param {string} fileName a file the checker read
 * @returns {boolean} the nearest package.json is a Tessera one
 */
const tesseraOwned = (fileName) => {
  for (let dir = dirname(resolve(fileName)); ; dir = dirname(dir)) {
    if (owners.has(dir)) return owners.get(dir);
    const name = packageNameIn(dir);
    if (name !== undefined) {
      owners.set(dir, TESSERA_IMPORT.test(name));
      return owners.get(dir);
    }
    if (dirname(dir) === dir) return false;
  }
};

export { tesseraOwned };
