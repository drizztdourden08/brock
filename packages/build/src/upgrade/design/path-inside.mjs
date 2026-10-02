/* @layer tooling-scripts @kind logic */
import { isAbsolute, relative } from 'node:path';

/**
 * @param {string} path
 * @param {string} dir
 * @returns {boolean} whether path is dir or lies below it
 */
const pathInside = (path, dir) => {
  const rel = relative(dir, path);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
};

export { pathInside };
