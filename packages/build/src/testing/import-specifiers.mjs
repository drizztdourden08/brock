/* @layer tooling-scripts @kind logic */
import { jsTokens } from './js-tokens.mjs';

const isPunct = (token, values) => token?.type === 'punct' && values.includes(token.value);

const keywordAt = (tokens, index, names) =>
  tokens[index]?.type === 'name' && names.includes(tokens[index].value) && !isPunct(tokens[index - 1], ['.']);

const isSpecifier = (tokens, index) => {
  if (keywordAt(tokens, index - 1, ['from', 'import'])) return true;
  if (!isPunct(tokens[index - 1], ['('])) return false;
  if (keywordAt(tokens, index - 2, ['require'])) return isPunct(tokens[index + 1], [')']);
  return keywordAt(tokens, index - 2, ['import']) && isPunct(tokens[index + 1], [')', ',']);
};

/**
 * @param {string} source a bundled JavaScript file
 * @returns {string[]} each import specifier the code holds, once
 */
const importSpecifiers = (source) => {
  const tokens = jsTokens(source);
  const specs = tokens.filter((token, index) => token.type === 'string' && isSpecifier(tokens, index)).map((token) => token.value);
  return [...new Set(specs)];
};

export { importSpecifiers };
