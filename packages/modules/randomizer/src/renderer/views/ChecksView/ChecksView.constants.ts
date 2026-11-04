/* @layer renderer-shell @kind constants */
import type { StatusMap } from '@drizztdourden08/tessera/primitives';
import type { LocationStatus } from '../../../tracker';
import type { ChecksPrefs, StatusFilter } from './ChecksView.type';

const DEFAULT_CHECKS_PREFS: ChecksPrefs = { grouping: 'region', filter: 'all', assumed: null, showItems: false, expanded: [] };

const STATUS_ORDER: readonly LocationStatus[] = ['available', 'blocked', 'checked'];

const STATUS_MAP: StatusMap<LocationStatus> = {
  checked: { label: 'Checked', tone: 'success' },
  available: { label: 'Available', tone: 'info' },
  blocked: { label: 'Blocked', tone: 'neutral' },
};

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'checked', label: 'Checked' },
];

const BASE_GROUPINGS: Readonly<Record<string, string>> = {
  region: 'Region',
  sphere: 'Sphere',
  status: 'Status',
};

const NO_TRACKER_MESSAGE = 'This game has no tracker.';
const NO_READING_MESSAGE = 'Waiting for the first reading.';
const NO_ROWS_MESSAGE = 'No locations match.';
const BAR_LABEL = 'Checks';
const SHOW_ITEMS_LABEL = 'Show item names';
const SEARCH_LABEL = 'Search locations';
const GROUPING_LABEL = 'Group by';
const FILTER_LABEL = 'Filter by status';
const SPHERE_PREFIX = 'Sphere';
const NO_SPHERE_GROUP = 'Out of logic';
const NO_SPHERE_ORDER = Number.MAX_SAFE_INTEGER;
const MARK_LABEL = 'Mark as checked';
const CLEAR_LABEL = 'Clear mark';
const MENU_GROUP_ID = 'mark';
const MARK_ITEM_ID = 'toggle-mark';
const TREE_ROOT_KEY = 'checks-root';

export {
  BAR_LABEL, BASE_GROUPINGS, CLEAR_LABEL, DEFAULT_CHECKS_PREFS, FILTER_LABEL, FILTER_OPTIONS, GROUPING_LABEL, MARK_ITEM_ID,
  MARK_LABEL, MENU_GROUP_ID, NO_READING_MESSAGE, NO_ROWS_MESSAGE, NO_SPHERE_GROUP, NO_SPHERE_ORDER, NO_TRACKER_MESSAGE, SEARCH_LABEL,
  SHOW_ITEMS_LABEL, SPHERE_PREFIX, STATUS_MAP, STATUS_ORDER, TREE_ROOT_KEY,
};
