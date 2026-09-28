/* @layer tooling-scripts @kind logic */
import { BADGE, BADGE_FILL_HEX, BADGE_INK_HEX, GLYPH_BODY, GLYPH_STROKE, GLYPH_SVG_PATHS, GLYPH_UNITS, SVG_VIEW as VIEW } from './bot.constants.mjs';

/**
 * @param {number} value
 */
const num = (value) => Number(value.toFixed(3));

/**
 * @param {Buffer} brandSvg  The brand icon, drawn under the badge
 * @returns {string}
 */
const botSvg = (brandSvg) => {
  const cx = num(BADGE.cx * VIEW);
  const cy = num(BADGE.cy * VIEW);
  const ring = num(BADGE.ring * VIEW);
  const side = num(BADGE.glyph * VIEW);
  const scale = num(side / GLYPH_UNITS);
  const { cx: bx, cy: by, hx, hy, r } = GLYPH_BODY;
  const glyph = [
    `<rect x="${bx - hx}" y="${by - hy}" width="${hx * 2}" height="${hy * 2}" rx="${r}"/>`,
    ...GLYPH_SVG_PATHS.map((d) => `<path d="${d}"/>`),
  ].join('');
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW} ${VIEW}">`,
    `<image href="data:image/svg+xml;base64,${brandSvg.toString('base64')}" width="${VIEW}" height="${VIEW}"/>`,
    `<circle cx="${cx}" cy="${cy}" r="${num(BADGE.radius * VIEW - ring / 2)}" fill="${BADGE_FILL_HEX}" stroke="${BADGE_INK_HEX}" stroke-width="${ring}"/>`,
    `<g transform="translate(${num(cx - side / 2)} ${num(cy - side / 2)}) scale(${scale})" fill="none" stroke="${BADGE_INK_HEX}"`,
    ` stroke-width="${GLYPH_STROKE * 2}" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>`,
    '</svg>',
    '',
  ].join('');
};

export { botSvg };
