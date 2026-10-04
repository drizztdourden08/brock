/* @layer tooling-scripts @kind logic */
import { NAMED_IMPORT } from './base-screen.constants.mjs';
import { localName } from './local-name.mjs';

/**
 * @param {string} source
 * @param {string} name a local name
 * @returns {{ start: number, end: number, from: string, names: string[] } | null} the import that brings the name in
 */
const namedImport = (source, name) => {
  for (const match of source.matchAll(NAMED_IMPORT)) {
    const names = match[2].split(',').map((part) => part.trim()).filter(Boolean);
    if (names.some((part) => localName(part) === name)) return { start: match.index, end: match.index + match[0].length, from: match[3], names };
  }
  return null;
};

export { namedImport };
