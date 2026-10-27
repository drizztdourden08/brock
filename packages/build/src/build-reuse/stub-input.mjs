/* @layer tooling-scripts @kind logic */
import { basename, extname } from 'node:path';
import { VIRTUAL_PREFIX } from './build-reuse.constants.mjs';

const nameOf = (path) => basename(path, extname(path));

const namesOf = (input) => {
  if (typeof input === 'string') return [nameOf(input)];
  return Array.isArray(input) ? input.map(nameOf) : Object.keys(input);
};

/**
 * @param {string | string[] | Record<string, string> | undefined} input the entries Rollup was given
 * @returns {Record<string, string>} the entry names, each an empty virtual module
 */
const stubInput = (input) => {
  if (!input) return {};
  return Object.fromEntries(namesOf(input).map((name) => [name, `${VIRTUAL_PREFIX}${name}`]));
};

export { stubInput };
