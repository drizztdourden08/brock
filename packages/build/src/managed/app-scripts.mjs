/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} appDir
 * @returns {Record<string, string>} the scripts in the app's package.json
 */
const appScripts = (appDir) => {
  const file = join(appDir, 'package.json');
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')).scripts ?? {}) : {};
};

export { appScripts };
