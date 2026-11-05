/* @layer renderer-shell @kind constants */
import type { SegmentOption, StatusMap } from '@drizztdourden08/tessera/primitives';
import type { LocationStatus } from '../../../tracker';
import type { ChecksPrefs, FacetMode, KindFilter, StatusFilter, ViewMode } from './ChecksView.type';

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

const STATUS_MAP: StatusMap<LocationStatus> = {
  checked: { label: 'Checked', tone: 'success' },
  available: { label: 'Available', tone: 'info' },
  blocked: { label: 'Blocked', tone: 'neutral' },
};

const FILTER_OPTIONS: SegmentOption<StatusFilter>[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'checked', label: 'Checked' },
];

const KIND_OPTIONS: SegmentOption<KindFilter>[] = [
  { value: 'all', label: 'All kinds' },
  { value: 'item', label: 'Items' },
  { value: 'reward', label: 'Rewards' },
  { value: 'event', label: 'Events' },
];

const VIEW_MODE_OPTIONS: SegmentOption<ViewMode>[] = [
  { value: 'compact', label: 'Compact', title: 'Check names only' },
  { value: 'detailed', label: 'Detailed', title: 'Check names with the item behind each' },
  { value: 'visual', label: 'Cards', title: 'One card per check' },
];

const FACET_MODE_OPTIONS: SegmentOption<FacetMode>[] = [
  { value: 'any', label: 'Any', title: 'Match any active tag' },
  { value: 'all', label: 'All', title: 'Match every active tag' },
];

const BASE_GROUPINGS: Readonly<Record<string, string>> = {
  region: 'Region',
  sphere: 'Sphere',
  status: 'Status',
};

const NO_TRACKER_MESSAGE = 'This game has no tracker.';
const NO_READING_MESSAGE = 'Waiting for the first reading.';
const NO_ROWS_MESSAGE = 'No locations match.';
const BAR_LABEL = 'Percent complete';
const SEARCH_LABEL = 'Search locations';
const SEARCH_PLACEHOLDER = 'Search checks...';
const GROUPING_LABEL = 'Group by';
const FILTER_LABEL = 'Filter by status';
const KIND_LABEL = 'Filter by kind';
const VIEW_MODE_LABEL = 'View mode';
const FILTERS_TOGGLE_LABEL = 'Filters and view options';
const FILTERS_LABEL = 'Filters';
const TAGS_LABEL = 'Tags';
const SPHERE_PREFIX = 'Sphere';
const NO_SPHERE_GROUP = 'Out of logic';
const NO_SPHERE_ORDER = Number.MAX_SAFE_INTEGER;
const MARK_LABEL = 'Mark as checked';
const CLEAR_LABEL = 'Clear mark';
const MENU_GROUP_ID = 'mark';
const MARK_ITEM_ID = 'toggle-mark';
const TREE_ROOT_KEY = 'checks-root';
const PLACEHOLDER_ART = '?';

export {
  BAR_LABEL, BASE_GROUPINGS, CLEAR_LABEL, DEFAULT_CHECKS_PREFS, FACET_MODE_OPTIONS, FILTERS_LABEL, FILTERS_TOGGLE_LABEL, FILTER_LABEL, FILTER_OPTIONS,
  GROUPING_LABEL, KIND_LABEL, KIND_OPTIONS, MARK_ITEM_ID, MARK_LABEL, MENU_GROUP_ID, NO_READING_MESSAGE, NO_ROWS_MESSAGE,
  NO_SPHERE_GROUP, NO_SPHERE_ORDER, NO_TRACKER_MESSAGE, PLACEHOLDER_ART, SEARCH_LABEL, SEARCH_PLACEHOLDER, SPHERE_PREFIX,
  STATUS_MAP, STATUS_ORDER, TAGS_LABEL, TREE_ROOT_KEY, VIEW_MODE_LABEL, VIEW_MODE_OPTIONS,
};
