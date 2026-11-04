/* @layer tooling-scripts @kind logic */

/**
 * @param {unknown} value  A token colour, #rgb or #rrggbb
 * @returns {string | undefined}  lower #rrggbb, else undefined
 */
const longHex = (value) => {
  if (typeof value !== 'string') return undefined;
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  if (!/^#[0-9a-f]{3}$/i.test(value)) return undefined;
  return `#${[...value.slice(1)].map((digit) => digit + digit).join('')}`.toLowerCase();
};

export { longHex };
