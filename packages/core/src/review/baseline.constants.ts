/* @layer core @kind constants */
const BASELINE_MASK_ATTRIBUTE = 'data-review-mask';
const BASELINE_MASK_SELECTOR = `[${BASELINE_MASK_ATTRIBUTE}]`;
const BUILT_IN_MASKS = [BASELINE_MASK_SELECTOR, '.logs-widget .log-panel__gutter'];
const REVIEW_MASK = { 'data-review-mask': '' } as const;
const BASELINE_DIR = 'tests/baselines';
const BASELINE_CONFIG_FILE = 'baselines.json';
const BASELINE_DIFF_DIR = 'diffs';
const BASELINE_CHECK = 'baseline';
const BASELINES_CHECK = 'baselines';
const BYTES_PER_PIXEL = 4;
const MAX_CHANNEL = 255;
const DIFF_COLOR = [255, 0, 64, 255] as const;
const MASK_COLOR = [64, 128, 255, 255] as const;
const FADE_WEIGHT = 0.25;
const FADE_BASE = 191;
const PERCENT = 100;
const PERCENT_DIGITS = 3;

export {
  BASELINE_CHECK, BASELINE_CONFIG_FILE, BASELINE_DIFF_DIR, BASELINE_DIR, BASELINE_MASK_ATTRIBUTE, BASELINE_MASK_SELECTOR, BASELINES_CHECK,
  BUILT_IN_MASKS, BYTES_PER_PIXEL, DIFF_COLOR, FADE_BASE, FADE_WEIGHT, MASK_COLOR, MAX_CHANNEL, PERCENT, PERCENT_DIGITS, REVIEW_MASK,
};
