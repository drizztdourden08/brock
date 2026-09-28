/* @layer tooling-scripts @kind logic */
import { badgeSample } from './badge-sample.mjs';
import { BADGE, SUPERSAMPLE } from './bot.constants.mjs';

/**
 * @param {number} x @param {number} y @param {number} size
 * @returns {number[]}  Average colour and coverage of the badge over one pixel
 */
const coverPixel = (x, y, size) => {
  const sum = [0, 0, 0, 0];
  for (let i = 0; i < SUPERSAMPLE * SUPERSAMPLE; i += 1) {
    const sx = (x + ((i % SUPERSAMPLE) + 0.5) / SUPERSAMPLE) / size;
    const sy = (y + (Math.floor(i / SUPERSAMPLE) + 0.5) / SUPERSAMPLE) / size;
    const colour = badgeSample(sx, sy);
    if (!colour) continue;
    for (let c = 0; c < 3; c += 1) sum[c] += colour[c];
    sum[3] += 1;
  }
  return sum[3] ? [...sum.slice(0, 3).map((value) => value / sum[3]), sum[3] / (SUPERSAMPLE * SUPERSAMPLE)] : sum;
};

/**
 * @param {Uint8Array} pixels @param {number} at @param {number[]} top  Colour and coverage
 */
const blendOver = (pixels, at, [r, g, b, coverage]) => {
  const below = pixels[at + 3] / 255;
  const alpha = coverage + below * (1 - coverage);
  if (alpha === 0) return;
  [r, g, b].forEach((value, c) => {
    pixels[at + c] = Math.round((value * coverage + pixels[at + c] * below * (1 - coverage)) / alpha);
  });
  pixels[at + 3] = Math.round(alpha * 255);
};

/**
 * @param {import('./read-png.mjs').RgbaImage} image  Square
 * @returns {import('./read-png.mjs').RgbaImage}  A copy with the bot badge in the corner
 */
const stampBadge = ({ width, height, pixels }) => {
  const out = new Uint8Array(pixels);
  const from = Math.floor((BADGE.cx - BADGE.radius) * width);
  const to = Math.min(width, Math.ceil((BADGE.cx + BADGE.radius) * width));
  for (let y = from; y < to; y += 1) {
    for (let x = from; x < to; x += 1) {
      const top = coverPixel(x, y, width);
      if (top[3] > 0) blendOver(out, (y * width + x) * 4, top);
    }
  }
  return { width, height, pixels: out };
};

export { stampBadge };
