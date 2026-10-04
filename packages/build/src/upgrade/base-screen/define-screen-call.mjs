/* @layer tooling-scripts @kind logic */
import { DEFINE_SCREEN } from './base-screen.constants.mjs';
import { closingIndex } from '../codemods/closing-index.mjs';
import { resolveString } from './resolve-string.mjs';

/**
 * @param {string} rootDir
 * @param {string} file root-relative
 * @param {string} source
 * @param {string} id
 * @returns {{ start: number, end: number, body: string } | null} the defineScreen call for that id
 */
const defineScreenCall = (rootDir, file, source, id) => {
  for (const match of source.matchAll(DEFINE_SCREEN)) {
    const open = match.index + match[0].length - 1;
    const body = source.slice(open, closingIndex(source, open, '{}') + 1);
    const idExpr = /\bid:\s*([^,\n}]+)/.exec(body)?.[1];
    if (idExpr !== undefined && resolveString(rootDir, file, source, idExpr) === id) {
      return { start: match.index, end: closingIndex(source, source.indexOf('(', match.index), '()') + 1, body };
    }
  }
  return null;
};

export { defineScreenCall };
