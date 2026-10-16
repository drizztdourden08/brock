/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

/**
 * @typedef {{ data: Buffer, mime: string, from: string }} ImageSource  from: where it was read
 */

/**
 * @param {string} base  the folder rel is under
 * @param {string | null} rel
 * @returns {ImageSource | null}  the SVG or PNG, or null when there is no such file
 */
const readImage = (base, rel) => {
  const file = rel ? join(base, rel) : null;
  if (!file || !existsSync(file)) return null;
  const mime = extname(file).toLowerCase() === '.svg' ? 'image/svg+xml' : 'image/png';
  return { data: readFileSync(file), mime, from: rel.split('\\').join('/') };
};

export { readImage };
