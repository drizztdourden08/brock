/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { PUBLIC_DIR, SPLASH_WORDMARK_HEIGHT } from './installer.constants.mjs';
import { readImage } from './read-image.mjs';

const PNG_HEIGHT_OFFSET = 20;
const PNG_HEADER_BYTES = 24;
const SVG_ROOT = /<svg\b[^>]*>/i;
const SVG_HEIGHT = /\sheight\s*=\s*["']\s*([\d.]+)\s*(px)?\s*["']/i;

/**
 * @param {import('./read-image.mjs').ImageSource} source
 * @returns {number | null}  its own height, null when the box sets it
 */
const ownHeight = (source) => {
  if (source.mime === 'image/png') return source.data.length >= PNG_HEADER_BYTES ? source.data.readUInt32BE(PNG_HEIGHT_OFFSET) : null;
  const root = SVG_ROOT.exec(source.data.toString('utf8'))?.[0] ?? '';
  const height = SVG_HEIGHT.exec(root);
  return height ? Number(height[1]) : null;
};

/**
 * @param {unknown} input  product.icons.wordmark as written
 * @returns {string[]}  the smooth wordmark files, none for pixel art
 */
const smoothFiles = (input) => {
  const wordmark = typeof input === 'string' ? { src: input } : input;
  if (typeof wordmark?.src !== 'string' || wordmark.rendering === 'pixelated') return [];
  return [...new Set([wordmark.src, typeof wordmark.dark === 'string' ? wordmark.dark : wordmark.src])];
};

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {string[]}  one warning per file under 48 px high
 */
const wordmarkHeightWarnings = (rootDir, product) =>
  smoothFiles(product.icons?.wordmark).flatMap((path) => {
    const source = readImage(rootDir, join(PUBLIC_DIR, path));
    const height = source ? ownHeight(source) : null;
    if (height === null || height >= SPLASH_WORDMARK_HEIGHT) return [];
    return [`product.icons.wordmark ${path} is ${height} px high, so the splashes draw it at ${height} px and never scale it up; ship it at least ${SPLASH_WORDMARK_HEIGHT} px high, or set rendering: 'pixelated' for pixel art`];
  });

export { wordmarkHeightWarnings };
