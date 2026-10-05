/* @layer tooling-scripts @kind logic */
import { escapeHtml } from '../splash/escape-html.mjs';
import { gradientLine } from './gradient-line.mjs';
import { imageSvg } from './image-svg.mjs';
import { SPLASH_FONT, SPLASH_GAP, SPLASH_MARK, SPLASH_NAME_SIZE } from './installer.constants.mjs';

/**
 * @typedef {object} SplashInput
 * @property {number} width @property {number} height
 * @property {import('./splash-ground.mjs').SplashGround} ground  the dark gradient and its text colour
 * @property {number} angle  CSS degrees, the look's
 * @property {import('./mark-source.mjs').MarkSource} mark  the mark in its dark ground colours
 * @property {string} name
 */

/**
 * @param {SplashInput} input
 * @returns {string}  the dark ground, the mark and the name
 */
const setupSplashSvg = ({ width, height, ground, angle, mark, name }) => {
  const { x1, y1, x2, y2 } = gradientLine(width, height, angle);
  const top = Math.round((height - (SPLASH_MARK + SPLASH_GAP + SPLASH_NAME_SIZE)) / 2);
  const baseline = top + SPLASH_MARK + SPLASH_GAP + Math.round(SPLASH_NAME_SIZE * 0.8);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    '<defs>',
    `<linearGradient id="ground" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">`,
    `<stop offset="0" stop-color="${ground.from}"/><stop offset="1" stop-color="${ground.to}"/>`,
    '</linearGradient>',
    '</defs>',
    `<rect width="${width}" height="${height}" fill="url(#ground)"/>`,
    imageSvg(mark, { x: (width - SPLASH_MARK) / 2, y: top, size: SPLASH_MARK }),
    `<text x="${width / 2}" y="${baseline}" text-anchor="middle" fill="${ground.ink}" font-family="${SPLASH_FONT}" font-weight="600" font-size="${SPLASH_NAME_SIZE}" letter-spacing="1">${escapeHtml(name)}</text>`,
    '</svg>',
  ].join('');
};

export { setupSplashSvg };
