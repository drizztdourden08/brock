/* @layer core @kind constants */
const DEFAULT_LOOK_ANGLE = 160;
const PALETTE_VIA_SHARE = 0.4;
const HEX_PAIR = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
const DEFAULT_INKS = { light: '#f2f3f7', dark: '#0e0f13' };
const DEFAULT_DIM_INK = '#9a9aa4';
const DIM_TEXT_RATIO = 4.5;
const PURE_BLACK = '#000000';
const DARK_STEP = 0.01;
const DARK_FROM_STEPS = 20;
const DARK_TO_STEPS = 7;

export {
  DARK_FROM_STEPS, DARK_STEP, DARK_TO_STEPS, DEFAULT_DIM_INK, DEFAULT_INKS, DEFAULT_LOOK_ANGLE, DIM_TEXT_RATIO, HEX_PAIR, PALETTE_VIA_SHARE, PURE_BLACK,
};
