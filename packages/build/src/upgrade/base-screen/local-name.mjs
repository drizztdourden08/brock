/* @layer tooling-scripts @kind logic */

/** @param {string} specifier `a` or `a as b` @returns {string} */
const localName = (specifier) => specifier.split(/\s+as\s+/).at(-1)?.replace(/^type\s+/, '').trim() ?? '';

export { localName };
