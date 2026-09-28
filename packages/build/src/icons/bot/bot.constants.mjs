/* @layer tooling-scripts @kind constants */
const BADGE = { cx: 0.74, cy: 0.74, radius: 0.235, ring: 0.03, glyph: 0.28 };
const BADGE_FILL = [27, 29, 34];
const BADGE_INK = [255, 255, 255];
const BADGE_FILL_HEX = '#1b1d22';
const BADGE_INK_HEX = '#ffffff';

const GLYPH_UNITS = 24;
const GLYPH_STROKE = 1;
const GLYPH_BODY = { cx: 12, cy: 14, hx: 8, hy: 6, r: 2 };
const GLYPH_SEGMENTS = [
  [12, 4, 12, 8],
  [8, 4, 12, 4],
  [2, 14, 4, 14],
  [20, 14, 22, 14],
  [15, 13, 15, 15],
  [9, 13, 9, 15],
];
const GLYPH_SVG_PATHS = ['M12 8V4H8', 'M2 14h2', 'M20 14h2', 'M15 13v2', 'M9 13v2'];

const SVG_VIEW = 100;
const SUPERSAMPLE = 4;
const ICO_SIZES = [256, 128, 64, 32, 16];

const BOT_SOURCES = { svg: 'icon/icon.svg', png: 'icon/png/icon-256.png' };
const BOT_TARGETS = { svg: 'public/logos/icon-bot.svg', png: 'public/logos/icon-bot-256.png', ico: 'public/logos/icon-bot.ico' };
const BOT_BRAND_DIR = 'bot';

/** @type {import('../brand-files.mjs').BrandFile[]} */
const BOT_BRAND_FILES = [
  { from: 'bot/icon.svg', to: BOT_TARGETS.svg },
  { from: 'bot/png/icon-256.png', to: BOT_TARGETS.png },
  { from: 'bot/icon.ico', to: BOT_TARGETS.ico },
];

export {
  BADGE, BADGE_FILL, BADGE_INK, BADGE_FILL_HEX, BADGE_INK_HEX, GLYPH_UNITS, GLYPH_STROKE, GLYPH_BODY, GLYPH_SEGMENTS,
  GLYPH_SVG_PATHS, SVG_VIEW, SUPERSAMPLE, ICO_SIZES, BOT_SOURCES, BOT_TARGETS, BOT_BRAND_DIR, BOT_BRAND_FILES,
};
