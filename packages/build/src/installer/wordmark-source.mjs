/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { PUBLIC_DIR, SPLASH_WORDMARK_RASTER } from './installer.constants.mjs';
import { rasteriseSvg } from './rasterise-svg.mjs';
import { readImage } from './read-image.mjs';

/**
 * @param {import('./read-image.mjs').ImageSource} source
 * @returns {import('./read-image.mjs').ImageSource}  a PNG, its text set in the system fonts
 */
const asPng = (source) => (source.mime === 'image/svg+xml'
  ? { ...source, data: rasteriseSvg(source.data.toString('utf8'), SPLASH_WORDMARK_RASTER), mime: 'image/png' }
  : source);

/**
 * @typedef {import('./read-image.mjs').ImageSource & { pixelated?: boolean }} WordmarkSource  pixelated: rendering
 */

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/product').ProductConfig} config
 * @returns {WordmarkSource | null}  the dark wordmark, null without one
 */
const wordmarkSourceOf = (rootDir, config) => {
  const wordmark = config.icons?.wordmark;
  if (!wordmark) return null;
  const source = readImage(rootDir, join(PUBLIC_DIR, wordmark.dark));
  if (!source) throw new Error(`product.icons.wordmark names ${wordmark.dark}, which is not under public/`);
  return wordmark.rendering === 'pixelated' ? { ...asPng(source), pixelated: true } : asPng(source);
};

export { wordmarkSourceOf };
