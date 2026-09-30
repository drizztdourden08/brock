/* @layer tooling-scripts @kind logic */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * @param {string} rootDir The app root
 * @param {string} name A package the app depends on
 * @returns {Promise<any>}
 */
const importFromApp = (rootDir, name) => {
  const appRequire = createRequire(join(rootDir, 'package.json'));
  return import(pathToFileURL(appRequire.resolve(name)).href);
};

export { importFromApp };
