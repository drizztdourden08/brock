/* @layer tooling-scripts @kind logic */

/**
 * @param {string} id a Rollup module id
 * @returns {string} the file path, without a query or a virtual prefix
 */
const moduleFile = (id) => id.replace(/^\0/, '').replace(/[?#].*$/, '').replace(/\\/g, '/');

export { moduleFile };
