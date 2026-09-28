/* @layer tooling-scripts @kind logic */
import { BADGE, BADGE_FILL, BADGE_INK, GLYPH_BODY, GLYPH_SEGMENTS, GLYPH_STROKE, GLYPH_UNITS } from './bot.constants.mjs';

/**
 * @param {number} px @param {number} py @param {number[]} segment  x1, y1, x2, y2
 */
const segmentDistance = (px, py, [x1, y1, x2, y2]) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - x1 - t * dx, py - y1 - t * dy);
};

/**
 * @param {number} px @param {number} py
 */
const roundRectDistance = (px, py) => {
  const { cx, cy, hx, hy, r } = GLYPH_BODY;
  const qx = Math.abs(px - cx) - hx + r;
  const qy = Math.abs(py - cy) - hy + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
};

/**
 * @param {number} u @param {number} v  Glyph units
 */
const onGlyph = (u, v) =>
  Math.abs(roundRectDistance(u, v)) <= GLYPH_STROKE
  || GLYPH_SEGMENTS.some((segment) => segmentDistance(u, v, segment) <= GLYPH_STROKE);

/**
 * @param {number} x @param {number} y  Fractions of the icon size
 * @returns {number[] | null}  The badge colour there, or null outside the badge
 */
const badgeSample = (x, y) => {
  const distance = Math.hypot(x - BADGE.cx, y - BADGE.cy);
  if (distance > BADGE.radius) return null;
  if (distance > BADGE.radius - BADGE.ring) return BADGE_INK;
  const origin = BADGE.glyph / 2;
  const u = ((x - BADGE.cx + origin) / BADGE.glyph) * GLYPH_UNITS;
  const v = ((y - BADGE.cy + origin) / BADGE.glyph) * GLYPH_UNITS;
  return onGlyph(u, v) ? BADGE_INK : BADGE_FILL;
};

export { badgeSample };
