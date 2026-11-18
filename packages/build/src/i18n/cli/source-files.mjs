/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SKIPPED_FOLDER, SOURCE_FILE } from './cli.constants.mjs';

/**
 * @param {string} rootDir the app root
 * @returns {string[]} absolute paths of the code files under src, locales left out
 */
const sourceFiles = (rootDir) => {
  const src = join(rootDir, 'src');
  if (!existsSync(src)) return [];
  return readdirSync(src, { recursive: true, encoding: 'utf8' })
    .filter((path) => SOURCE_FILE.test(path) && !SKIPPED_FOLDER.test(path))
    .map((path) => join(src, path));
};

export { sourceFiles };
