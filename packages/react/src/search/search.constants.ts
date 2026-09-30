/* @layer renderer-shell @kind constants */
import type { FieldWeights, SearchKind } from './search.type';

const LABEL_WEIGHTS: FieldWeights = { exact: 100, prefix: 60, wordStart: 40, substring: 20 };
const KEYWORD_WEIGHTS: FieldWeights = { exact: 30, prefix: 20, wordStart: 15, substring: 8 };
const DESCRIPTION_WEIGHTS: FieldWeights = { exact: 10, prefix: 8, wordStart: 6, substring: 3 };
const BREADCRUMB_WEIGHTS: FieldWeights = { exact: 15, prefix: 10, wordStart: 8, substring: 4 };
const KIND_BOOST: Record<SearchKind, number> = { screen: 6, page: 6, tab: 5, section: 2, setting: 1, entry: 1, widget: 2, action: 2 };
const SETTINGS_SCREEN = 'settings';
const SETTINGS_BREADCRUMB = 'Settings';
const ANCHOR_BUDGET_MS = 1500;
const ANCHOR_FLASH_MS = 1200;
const ANCHOR_FLASH_CLASS = 'search-hit';
const ANCHOR_ATTRIBUTES: readonly string[] = ['data-setting-key', 'data-section', 'data-search-anchor'];
const SCREEN_ID_PREFIX = 'screen:';
const SETTING_ID_PREFIX = 'setting:';
const WORD_SPLIT = /[\s,;/|]+/;
const EDGE_PUNCTUATION = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu;

export {
  ANCHOR_ATTRIBUTES, ANCHOR_BUDGET_MS, ANCHOR_FLASH_CLASS, ANCHOR_FLASH_MS, BREADCRUMB_WEIGHTS, DESCRIPTION_WEIGHTS, EDGE_PUNCTUATION, KEYWORD_WEIGHTS,
  KIND_BOOST, LABEL_WEIGHTS, SCREEN_ID_PREFIX, SETTING_ID_PREFIX, SETTINGS_BREADCRUMB, SETTINGS_SCREEN, WORD_SPLIT,
};
