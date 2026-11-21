/* @layer renderer-shell @kind constants */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import type { LocationStatus } from '../../../tracker';
import type { ChecksOption, ChecksPrefs, FacetMode, KindFilter, StatusDef, StatusFilter, ViewMode } from './ChecksView.type';

const DEFAULT_CHECKS_PREFS: ChecksPrefs = {
  grouping: 'region',
  filter: 'all',
  kind: 'all',
  facets: [],
  facetMode: 'any',
  assumed: null,
  viewMode: 'compact',
  expanded: [],
};

const STATUS_ORDER: readonly LocationStatus[] = ['available', 'blocked', 'checked'];

const STATUS_DEFS: Readonly<Record<LocationStatus, StatusDef>> = {
  checked: { label: msg('randomizer:checks.status.checked'), tone: 'success' },
  available: { label: msg('randomizer:checks.status.available'), tone: 'info' },
  blocked: { label: msg('randomizer:checks.status.blocked'), tone: 'neutral' },
};

const FILTER_OPTIONS: ChecksOption<StatusFilter>[] = [
  { value: 'all', label: msg('randomizer:checks.filter.all') },
  { value: 'available', label: msg('randomizer:checks.status.available') },
  { value: 'blocked', label: msg('randomizer:checks.status.blocked') },
  { value: 'checked', label: msg('randomizer:checks.status.checked') },
];

const KIND_OPTIONS: ChecksOption<KindFilter>[] = [
  { value: 'all', label: msg('randomizer:checks.kindFilter.all') },
  { value: 'item', label: msg('randomizer:checks.kindFilter.item') },
  { value: 'reward', label: msg('randomizer:checks.kindFilter.reward') },
  { value: 'event', label: msg('randomizer:checks.kindFilter.event') },
];

const VIEW_MODE_OPTIONS: ChecksOption<ViewMode>[] = [
  { value: 'compact', label: msg('randomizer:checks.view.compact'), title: msg('randomizer:checks.view.compactTitle') },
  { value: 'detailed', label: msg('randomizer:checks.view.detailed'), title: msg('randomizer:checks.view.detailedTitle') },
  { value: 'visual', label: msg('randomizer:checks.view.visual'), title: msg('randomizer:checks.view.visualTitle') },
];

const FACET_MODE_OPTIONS: ChecksOption<FacetMode>[] = [
  { value: 'any', label: msg('randomizer:checks.facetMode.any'), title: msg('randomizer:checks.facetMode.anyTitle') },
  { value: 'all', label: msg('randomizer:checks.facetMode.all'), title: msg('randomizer:checks.facetMode.allTitle') },
];

const BASE_GROUPINGS: Readonly<Record<string, Text>> = {
  region: msg('randomizer:checks.grouping.region'),
  sphere: msg('randomizer:checks.grouping.sphere'),
  status: msg('randomizer:checks.grouping.status'),
};

const NO_TRACKER_MESSAGE = msg('randomizer:checks.noTracker');
const NO_READING_MESSAGE = msg('randomizer:checks.noReading');
const NO_ROWS_MESSAGE = msg('randomizer:checks.noRows');
const BAR_LABEL = msg('randomizer:checks.barLabel');
const SEARCH_LABEL = msg('randomizer:checks.searchLabel');
const SEARCH_PLACEHOLDER = msg('randomizer:checks.searchPlaceholder');
const GROUPING_LABEL = msg('randomizer:checks.groupingLabel');
const FILTER_LABEL = msg('randomizer:checks.filterLabel');
const KIND_LABEL = msg('randomizer:checks.kindLabel');
const VIEW_MODE_LABEL = msg('randomizer:checks.viewModeLabel');
const FILTERS_TOGGLE_LABEL = msg('randomizer:checks.filtersToggle');
const FILTERS_LABEL = msg('randomizer:checks.filters');
const TAGS_LABEL = msg('randomizer:checks.tags');
const NO_SPHERE_GROUP = msg('randomizer:checks.outOfLogic');
const NO_SPHERE_ORDER = Number.MAX_SAFE_INTEGER;
const MARK_LABEL = msg('randomizer:checks.mark');
const CLEAR_LABEL = msg('randomizer:checks.clearMark');
const EVENT_LABEL = msg('randomizer:checks.event');
const UNKNOWN_ITEM_LABEL = msg('randomizer:checks.unknownItem');
const TOTAL_LABEL = msg('randomizer:checks.total');
const GROUP_COUNTS_TITLE = msg('randomizer:checks.groupCountsTitle');
const MENU_GROUP_ID = 'mark';
const MARK_ITEM_ID = 'toggle-mark';
const TREE_ROOT_KEY = 'checks-root';
const PLACEHOLDER_ART = '?';

export {
  BAR_LABEL, BASE_GROUPINGS, CLEAR_LABEL, DEFAULT_CHECKS_PREFS, EVENT_LABEL, FACET_MODE_OPTIONS, FILTERS_LABEL, FILTERS_TOGGLE_LABEL, FILTER_LABEL, FILTER_OPTIONS,
  GROUPING_LABEL, GROUP_COUNTS_TITLE, KIND_LABEL, KIND_OPTIONS, MARK_ITEM_ID, MARK_LABEL, MENU_GROUP_ID, NO_READING_MESSAGE, NO_ROWS_MESSAGE,
  NO_SPHERE_GROUP, NO_SPHERE_ORDER, NO_TRACKER_MESSAGE, PLACEHOLDER_ART, SEARCH_LABEL, SEARCH_PLACEHOLDER,
  STATUS_DEFS, STATUS_ORDER, TAGS_LABEL, TOTAL_LABEL, TREE_ROOT_KEY, UNKNOWN_ITEM_LABEL, VIEW_MODE_LABEL, VIEW_MODE_OPTIONS,
};
