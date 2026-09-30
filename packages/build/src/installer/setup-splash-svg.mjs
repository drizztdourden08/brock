/* @layer tooling-scripts @kind logic */
import { escapeHtml } from '../splash/escape-html.mjs';
import { gradientLine } from './gradient-line.mjs';
import { imageSvg } from './image-svg.mjs';
import {
  SPLASH_FONT, SPLASH_GAP, SPLASH_GLOW_OPACITY, SPLASH_MARK, SPLASH_NAME_SIZE, SPLASH_SHADOW_OPACITY,
} from './installer.constants.mjs';

/**
 * @typedef {object} SplashInput
 * @property {number} width @property {number} height
 * @property {import('./stub-colours.mjs').StubColours} colours
 * @property {import('./mark-source.mjs').MarkSource} mark
 * @property {string} name
 */

/**
 * @param {number} width
 * @param {number} height
 */
const glowRadius = (width, height) => Math.round(0.58 * Math.hypot(width / 2, height * 0.6));

/**
 * @param {SplashInput} input
 * @returns {string}  the Setup splash: gradient, mark and name
 */
const setupSplashSvg = ({ width, height, colours, mark, name }) => {
  const { x1, y1, x2, y2 } = gradientLine(width, height, colours.angle);
  const top = Math.round((height - (SPLASH_MARK + SPLASH_GAP + SPLASH_NAME_SIZE)) / 2);
  const baseline = top + SPLASH_MARK + SPLASH_GAP + Math.round(SPLASH_NAME_SIZE * 0.8);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    '<defs>',
    `<linearGradient id="look" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">`,
    `<stop offset="0" stop-color="${colours.from}"/><stop offset="0.5" stop-color="${colours.via}"/><stop offset="1" stop-color="${colours.to}"/>`,
    '</linearGradient>',
    `<radialGradient id="glow" gradientUnits="userSpaceOnUse" cx="${width / 2}" cy="${Math.round(height * 0.4)}" r="${glowRadius(width, height)}">`,
    `<stop offset="0" stop-color="#ffffff" stop-opacity="${SPLASH_GLOW_OPACITY}"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>`,
    '</radialGradient>',
    `<filter id="lift" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="${SPLASH_SHADOW_OPACITY}"/></filter>`,
    '</defs>',
    `<rect width="${width}" height="${height}" fill="url(#look)"/>`,
    `<rect width="${width}" height="${height}" fill="url(#glow)"/>`,
    imageSvg(mark, { x: (width - SPLASH_MARK) / 2, y: top, size: SPLASH_MARK, extra: ' filter="url(#lift)"' }),
    `<text x="${width / 2}" y="${baseline}" text-anchor="middle" fill="${colours.ink}" font-family="${SPLASH_FONT}" font-weight="600" font-size="${SPLASH_NAME_SIZE}" letter-spacing="1">${escapeHtml(name)}</text>`,
    '</svg>',
  ].join('');
};

export { setupSplashSvg };
