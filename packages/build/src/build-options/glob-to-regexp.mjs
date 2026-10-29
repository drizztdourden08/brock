/* @layer tooling-scripts @kind logic */
const SPECIAL = /[.+^${}()|[\]\\]/g;

const TOKENS = [
  [/^\*\*\//, '(?:.*/)?'],
  [/^\*\*/, '.*'],
  [/^\*/, '[^/]*'],
  [/^\?/, '[^/]'],
];

/**
 * @param {string} glob a path glob; ** crosses folders, * and ? do not
 * @returns {RegExp} matches the path it names and everything under it
 */
const globToRegExp = (glob) => {
  let rest = glob.replace(/^\.\//, '').replace(/\/$/, '');
  let source = '';
  while (rest) {
    const token = TOKENS.find(([pattern]) => pattern.test(rest));
    if (token) {
      source += token[1];
      rest = rest.replace(token[0], '');
    } else {
      source += rest[0].replace(SPECIAL, '\\$&');
      rest = rest.slice(1);
    }
  }
  return new RegExp(`^${source}(?:/.*)?$`);
};

export { globToRegExp };
