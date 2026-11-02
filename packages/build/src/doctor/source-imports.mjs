/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { packageNameOf } from '../declared-externals.mjs';

const SOURCE_DIRS = ['src', 'electron', 'server'];
const SKIPPED_DIRS = new Set(['node_modules', 'dist', 'out', '.brock', 'tests', '__tests__']);
const SOURCE_FILE = /\.[cm]?[jt]sx?$/;
const TEST_FILE = /\.(test|spec)\.[cm]?[jt]sx?$/;
const PACKAGE_NAME = /^(@[\w.-]+\/)?[\w][\w.-]*$/;
const STATEMENT = /^\s*(?:import|export)\s+(?:[^'";]*?\s+from\s*)?['"]([^'"]+)['"]/gm;
const CALL = /\b(?:import|require)\(\s*['"]([^'"]+)['"]\s*\)/g;

/** @param {string} dir @returns {string[]} */
const filesIn = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return SKIPPED_DIRS.has(entry.name) ? [] : filesIn(path);
    return SOURCE_FILE.test(entry.name) && !TEST_FILE.test(entry.name) ? [path] : [];
  });

/** @param {string} source @returns {string[]} the module specifiers the file loads */
const specifiersOf = (source) => [...source.matchAll(STATEMENT), ...source.matchAll(CALL)].map((match) => match[1]);

/**
 * @param {string} rootDir the app folder
 * @param {string[]} [aliases] path alias prefixes the app maps itself
 * @returns {Map<string, string[]>} each imported package and the app files that import it
 */
const importedPackages = (rootDir, aliases = []) => {
  const found = new Map();
  const files = SOURCE_DIRS.map((dir) => join(rootDir, dir)).filter((dir) => existsSync(dir)).flatMap(filesIn).sort();
  for (const file of files) {
    for (const specifier of specifiersOf(readFileSync(file, 'utf8'))) {
      if (aliases.some((alias) => specifier === alias || specifier.startsWith(`${alias}/`))) continue;
      const name = packageNameOf(specifier);
      if (!name || !PACKAGE_NAME.test(name)) continue;
      const path = relative(rootDir, file).replace(/\\/g, '/');
      found.set(name, [...new Set([...(found.get(name) ?? []), path])]);
    }
  }
  return found;
};

export { importedPackages };
