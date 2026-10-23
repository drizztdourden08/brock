/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { HELPER_NAME, HELPER_SOURCE, HELPERS_LABEL } from './helper-scripts.constants.mjs';

const fail = (message) => {
  throw new Error(`${HELPERS_LABEL}${message}`);
};

const checkEntry = (rootDir, name, entry) => {
  if (!HELPER_NAME.test(name)) fail(`: "${name}" is not a helper name; use lower case letters, digits and dashes.`);
  if (typeof entry !== 'string' || !HELPER_SOURCE.test(entry)) fail(`.${name} names a .ts, .mts, .js or .mjs file, relative to the app folder.`);
  if (isAbsolute(entry)) fail(`.${name} is an absolute path; give it relative to the app folder.`);
  const full = resolve(rootDir, entry);
  if (relative(rootDir, full).startsWith('..')) fail(`.${name} leaves the app folder.`);
  if (!existsSync(full)) fail(`.${name}: ${entry} does not exist.`);
  return full;
};

/**
 * @param {string} rootDir the app folder
 * @param {Record<string, string> | undefined} helpers helpers of brock.config.ts
 * @returns {{ name: string, entry: string }[]} each helper and its absolute entry file
 */
const helperEntries = (rootDir, helpers) => {
  if (helpers === undefined) return [];
  if (typeof helpers !== 'object' || helpers === null || Array.isArray(helpers)) fail(' maps a helper name to its entry file.');
  return Object.entries(helpers).map(([name, entry]) => ({ name, entry: checkEntry(rootDir, name, entry) }));
};

export { helperEntries };
