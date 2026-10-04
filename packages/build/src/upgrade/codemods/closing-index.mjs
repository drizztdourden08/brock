/* @layer tooling-scripts @kind logic */
import { stringEnd } from './string-end.mjs';

const quoteChars = '"\'`';

/**
 * @param {string} source
 * @param {number} at the index of the opening bracket
 * @param {string} pair the two brackets, '()' or '[]' or '{}'
 * @returns {number} the index of the matching closing bracket
 */
const closingIndex = (source, at, pair) => {
  let depth = 0;
  for (let i = at; i < source.length; i += 1) {
    if (quoteChars.includes(source[i])) i = stringEnd(source, i);
    else if (source[i] === pair[0]) depth += 1;
    else if (source[i] === pair[1]) depth -= 1;
    if (depth === 0) return i;
  }
  return source.length;
};

export { closingIndex };
