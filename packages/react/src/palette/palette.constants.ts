/* @layer renderer-shell @kind constants */
import type { FieldWeights, SearchKind } from './palette.type';

const LABEL_WEIGHTS: FieldWeights = { exact: 100, prefix: 60, wordStart: 40, substring: 20 };
const KEYWORD_WEIGHTS: FieldWeights = { exact: 30, prefix: 20, wordStart: 15, substring: 8 };
const DESCRIPTION_WEIGHTS: FieldWeights = { exact: 10, prefix: 8, wordStart: 6, substring: 3 };
const BREADCRUMB_WEIGHTS: FieldWeights = { exact: 15, prefix: 10, wordStart: 8, substring: 4 };
const KIND_BOOST: Record<SearchKind, number> = { screen: 6, tab: 6, action: 2, setting: 0 };
const IDLE_SCREEN_LIMIT = 8;
const SETTINGS_SCREEN = 'settings';
const SETTINGS_BREADCRUMB = 'Settings';
const ANCHOR_BUDGET_MS = 600;
const ANCHOR_FLASH_MS = 1200;
const ANCHOR_FLASH_CLASS = 'is-search-hit';
const PALETTE_KEY = 'k';
const ARROW_STEP: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };

export {
  ARROW_STEP, ANCHOR_BUDGET_MS, ANCHOR_FLASH_CLASS, ANCHOR_FLASH_MS, BREADCRUMB_WEIGHTS, DESCRIPTION_WEIGHTS, IDLE_SCREEN_LIMIT,
  KEYWORD_WEIGHTS, KIND_BOOST, LABEL_WEIGHTS, PALETTE_KEY, SETTINGS_BREADCRUMB, SETTINGS_SCREEN,
};
