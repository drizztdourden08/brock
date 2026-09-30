/* @layer tooling-scripts @kind logic */
const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)["']([^"'\n]+)["']/g;

/**
 * @param {string} source a bundled JavaScript file
 * @returns {string[]} every static, dynamic and require specifier, once each
 */
const importSpecifiers = (source) => [...new Set([...source.matchAll(SPECIFIER)].map((match) => match[1]))];

export { importSpecifiers };
