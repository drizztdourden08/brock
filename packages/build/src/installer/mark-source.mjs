/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { BRAND_DIR, BRAND_MARK_PNG, DEFAULT_MARK, PUBLIC_DIR, TILED_ICON } from './installer.constants.mjs';

/**
 * @typedef {{ data: Buffer, mime: string, from: string }} MarkSource  from: where it was read
 */

/**
 * @param {string} base  the folder rel is under
 * @param {string | null} rel
 * @returns {MarkSource | null}
 */
const readImage = (base, rel) => {
  const file = rel ? join(base, rel) : null;
  if (!file || !existsSync(file)) return null;
  const mime = extname(file).toLowerCase() === '.svg' ? 'image/svg+xml' : 'image/png';
  return { data: readFileSync(file), mime, from: rel.split('\\').join('/') };
};

/**
 * @param {string} rootDir  The app root
 * @param {Pick<import('./installer-inputs.mjs').InstallerInputs, 'config' | 'tesseraRoot'>} inputs
 * @returns {MarkSource | null}  the transparent mark, the tiled icon last
 */
const markSourceOf = (rootDir, { config, tesseraRoot }) => {
  const brand = config.icons?.brand;
  const ownMark = join(PUBLIC_DIR, config.logos.mark);
  const brandPng = brand && config.logos.mark === DEFAULT_MARK ? join(BRAND_DIR, brand, BRAND_MARK_PNG) : null;
  return readImage(tesseraRoot, brandPng)
    ?? readImage(rootDir, ownMark)
    ?? readImage(tesseraRoot, brand ? join(BRAND_DIR, `${brand}.svg`) : null)
    ?? readImage(rootDir, config.icons?.png256 ?? TILED_ICON);
};

export { markSourceOf };
