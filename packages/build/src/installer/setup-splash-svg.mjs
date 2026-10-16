/* @layer tooling-scripts @kind logic */
import { escapeHtml } from '../splash/escape-html.mjs';
import { gradientLine } from './gradient-line.mjs';
import { imageSvg } from './image-svg.mjs';
import { SPLASH_FONT, SPLASH_GAP, SPLASH_MARK, SPLASH_NAME_SIZE, SPLASH_WORDMARK_HEIGHT, SPLASH_WORDMARK_WIDTH } from './installer.constants.mjs';

/**
 * @typedef {object} SplashInput
 * @property {number} width @property {number} height
 * @property {import('./splash-ground.mjs').SplashGround} ground  the dark gradient and its text colour
 * @property {number} angle  CSS degrees, the look's
 * @property {import('./mark-source.mjs').MarkSource} mark  the mark in its dark ground colours
 * @property {string} name
 * @property {string | null} [family]  the title font's family, ahead of Segoe UI
 * @property {import('./read-image.mjs').ImageSource | null} [wordmark]  the dark ground wordmark, drawn in place of the name
 */

/**
 * @param {Pick<SplashInput, 'width' | 'ground' | 'name' | 'family'>} input
 * @param {number} top  where the name's line starts
 * @returns {string}  the name as text in the title font
 */
const nameSvg = ({ width, ground, name, family = null }, top) => {
  const fonts = escapeHtml(family ? `'${family}', '${SPLASH_FONT}'` : SPLASH_FONT);
  const baseline = top + Math.round(SPLASH_NAME_SIZE * 0.8);
  return `<text x="${width / 2}" y="${baseline}" text-anchor="middle" fill="${ground.ink}" font-family="${fonts}" font-weight="600" font-size="${SPLASH_NAME_SIZE}" letter-spacing="1">${escapeHtml(name)}</text>`;
};

/**
 * @param {import('./read-image.mjs').ImageSource} wordmark
 * @param {number} width  the splash width
 * @param {number} top  where the wordmark's box starts
 * @returns {string}  the wordmark, fitted and centred in its box
 */
const wordmarkSvg = (wordmark, width, top) => {
  const box = Math.min(SPLASH_WORDMARK_WIDTH, width - 2 * SPLASH_GAP);
  return imageSvg(wordmark, { x: (width - box) / 2, y: top, size: box, height: SPLASH_WORDMARK_HEIGHT });
};

/**
 * @param {SplashInput} input
 * @returns {string}  the ground, the mark, then the name or wordmark
 */
const setupSplashSvg = (input) => {
  const { width, height, ground, angle, mark, wordmark = null } = input;
  const { x1, y1, x2, y2 } = gradientLine(width, height, angle);
  const titleHeight = wordmark ? SPLASH_WORDMARK_HEIGHT : SPLASH_NAME_SIZE;
  const top = Math.round((height - (SPLASH_MARK + SPLASH_GAP + titleHeight)) / 2);
  const titleTop = top + SPLASH_MARK + SPLASH_GAP;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    '<defs>',
    `<linearGradient id="ground" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">`,
    `<stop offset="0" stop-color="${ground.from}"/><stop offset="1" stop-color="${ground.to}"/>`,
    '</linearGradient>',
    '</defs>',
    `<rect width="${width}" height="${height}" fill="url(#ground)"/>`,
    imageSvg(mark, { x: (width - SPLASH_MARK) / 2, y: top, size: SPLASH_MARK }),
    wordmark ? wordmarkSvg(wordmark, width, titleTop) : nameSvg(input, titleTop),
    '</svg>',
  ].join('');
};

export { setupSplashSvg };
