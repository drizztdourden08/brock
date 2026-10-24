/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} rootDir the app folder
 * @param {string} path a managed file, from the app folder
 * @returns {string} its text with LF line endings
 */
const readManagedFile = (rootDir, path) => {
  const file = join(rootDir, path);
  if (!existsSync(file)) throw new Error(`${path} is missing; run brock sync.`);
  return readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
};

export { readManagedFile };
