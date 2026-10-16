/* @layer renderer-shell @kind constants */
import { TESSERA_STRINGS } from '@drizztdourden08/tessera/primitives';
import type { BarMarker, MenuEntryOverride, MenuGroupId, TuckedRow } from './menu-config.type';

const MENU_GROUP_IDS: readonly MenuGroupId[] = ['main', 'sections', 'modules', 'end'];

const END_GROUP: MenuGroupId = 'end';

const OVERRIDE_CHECKS: Readonly<Record<keyof MenuEntryOverride, (value: unknown) => boolean>> = {
  hidden: (value) => typeof value === 'boolean',
  inMenu: (value) => typeof value === 'boolean',
  label: (value) => typeof value === 'string' && value.trim() !== '',
  activeLabel: (value) => typeof value === 'string' && value.trim() !== '',
  group: (value) => typeof value === 'string' && (MENU_GROUP_IDS as readonly string[]).includes(value),
  order: (value) => typeof value === 'number' && Number.isFinite(value),
  before: (value) => typeof value === 'string' && value !== '',
  after: (value) => typeof value === 'string' && value !== '',
  parent: (value) => value === null || (typeof value === 'string' && value !== ''),
};

const OVERRIDE_WANTS: Readonly<Record<keyof MenuEntryOverride, string>> = {
  hidden: 'true or false',
  inMenu: 'true or false',
  label: 'a non-empty text',
  activeLabel: 'a non-empty text',
  group: MENU_GROUP_IDS.map((id) => `'${id}'`).join(', '),
  order: 'a number',
  before: 'an entry key',
  after: 'an entry key',
  parent: 'a submenu key, or null for the top level',
};

const VIEW_MENU_KEY = 'view';

const VIEW_MARKER_GROUP: MenuGroupId = 'modules';

const VIEW_PLACE_FIELDS: readonly (keyof MenuEntryOverride)[] = ['hidden', 'inMenu', 'group', 'order', 'before', 'after'];

const WINDOW_PIN_KEY = 'window-pin';

const WINDOW_FULLSCREEN_KEY = 'window-fullscreen';

const TUCKED_ROWS: Readonly<Record<TuckedRow, string>> = { pin: WINDOW_PIN_KEY, fullscreen: WINDOW_FULLSCREEN_KEY };

const TUCKED_KEYS: ReadonlySet<string> = new Set(Object.values(TUCKED_ROWS));

const TUCKED_PLACE_FIELDS: readonly (keyof MenuEntryOverride)[] = ['group', 'order', 'before', 'after'];

const BAR_MARKERS: readonly BarMarker[] = [
  { key: VIEW_MENU_KEY, ref: 'menu.entries.view', name: 'View', label: TESSERA_STRINGS.windows.view, fields: VIEW_PLACE_FIELDS },
  { key: WINDOW_PIN_KEY, ref: `menu.entries["${WINDOW_PIN_KEY}"]`, name: 'Pin on top', label: TESSERA_STRINGS.windows.pinOnTop, fields: TUCKED_PLACE_FIELDS },
  { key: WINDOW_FULLSCREEN_KEY, ref: `menu.entries["${WINDOW_FULLSCREEN_KEY}"]`, name: 'Full screen', label: TESSERA_STRINGS.windows.fullscreen, fields: TUCKED_PLACE_FIELDS },
];

const BAR_MARKER_KEYS: ReadonlySet<string> = new Set(BAR_MARKERS.map((marker) => marker.key));

const KEY_SUGGESTIONS = 3;

export {
  BAR_MARKER_KEYS, BAR_MARKERS, END_GROUP, KEY_SUGGESTIONS, MENU_GROUP_IDS, OVERRIDE_CHECKS, OVERRIDE_WANTS, TUCKED_KEYS, TUCKED_ROWS, VIEW_MARKER_GROUP, VIEW_MENU_KEY,
};
