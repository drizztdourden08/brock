/* @layer tooling-scripts @kind logic */

/**
 * @param {string} source
 * @param {number} at the index of an opening quote
 * @returns {number} the index of its closing quote
 */
const stringEnd = (source, at) => {
  for (let i = at + 1; i < source.length; i += 1) {
    if (source[i] === '\\') i += 1;
    else if (source[i] === source[at]) return i;
  }
  return source.length;
};

export { stringEnd };
