/* @layer tooling-scripts @kind logic */
import { existsSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';
import { MODULE_SUFFIXES } from './base-screen.constants.mjs';

const isFile = (path) => existsSync(path) && statSync(path).isFile();

/**
 * @param {string} rootDir
 * @param {string} fromFile root-relative
 * @param {string} specifier
 * @returns {string | null} the root-relative file a relative import names
 */
const resolveModule = (rootDir, fromFile, specifier) => {
  if (!specifier.startsWith('.')) return null;
  const base = posix.join(posix.dirname(fromFile), specifier);
  return [base, ...MODULE_SUFFIXES.map((suffix) => `${base}${suffix}`)].find((path) => isFile(join(rootDir, path))) ?? null;
};

export { resolveModule };
