/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DECLARATION_FILE, SKIPPED_DIRS, SOURCE_FILE, TEST_FILE } from './optimize-deps.constants.mjs';

const isSource = (name) => SOURCE_FILE.test(name) && !TEST_FILE.test(name) && !DECLARATION_FILE.test(name);

/**
 * @param {string} dir a source folder
 * @returns {string[]} its scripts, tests and output left out
 */
const sourceFilesUnder = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return SKIPPED_DIRS.has(entry.name) || entry.name.startsWith('.') ? [] : sourceFilesUnder(path);
    return entry.isFile() && isSource(entry.name) ? [path] : [];
  });
};

export { sourceFilesUnder };
