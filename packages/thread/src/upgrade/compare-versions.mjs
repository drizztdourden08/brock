/* @layer tooling-scripts @kind logic */
const partsOf = (version) => String(version).replace(/^[\^~v=]+/, '').split(/[.+-]/).slice(0, 3).map((part) => Number.parseInt(part, 10) || 0);

/**
 * @param {string} a
 * @param {string} b
 * @returns {number} below 0 when a is older, 0 when equal, above 0 when newer
 */
const compareVersions = (a, b) => {
  const [x, y] = [partsOf(a), partsOf(b)];
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

export { compareVersions };
