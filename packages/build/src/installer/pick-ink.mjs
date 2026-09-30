/* @layer tooling-scripts @kind logic */

/**
 * @param {number} value  0 to 255
 */
const linear = (value) => {
  const share = value / 255;
  return share <= 0.03928 ? share / 12.92 : ((share + 0.055) / 1.055) ** 2.4;
};

/**
 * @param {string} hex  #rrggbb
 */
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((at) => linear(parseInt(hex.slice(at, at + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * @param {string} a
 * @param {string} b
 */
const contrast = (a, b) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

/**
 * @param {string} background  #rrggbb
 * @param {string[]} inks  candidates, first wins a tie
 * @returns {string}  the ink that reads best on the background
 */
const pickInk = (background, inks) =>
  inks.reduce((best, ink) => (contrast(background, ink) > contrast(background, best) ? ink : best));

export { pickInk };
