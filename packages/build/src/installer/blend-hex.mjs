/* @layer tooling-scripts @kind logic */

/**
 * @param {string} hex  #rrggbb
 * @returns {number[]}
 */
const channelsOf = (hex) => [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16));

/**
 * @param {string} a  #rrggbb
 * @param {string} b  #rrggbb
 * @param {number} shareOfA  0 to 1
 * @returns {string}  #rrggbb, lower case
 */
const blendHex = (a, b, shareOfA) => {
  const right = channelsOf(b);
  const mixed = channelsOf(a).map((value, i) => Math.round(value * shareOfA + right[i] * (1 - shareOfA)));
  return `#${mixed.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
};

export { blendHex };
