/* @layer renderer-shell @kind constants */
import type { MenuEntryOverride, MenuGroupId } from './menu-config.type';

const MENU_GROUP_IDS: readonly MenuGroupId[] = ['main', 'sections', 'modules', 'end'];

const END_GROUP: MenuGroupId = 'end';

const OVERRIDE_CHECKS: Readonly<Record<keyof MenuEntryOverride, (value: unknown) => boolean>> = {
  hidden: (value) => typeof value === 'boolean',
  inMenu: (value) => typeof value === 'boolean',
  label: (value) => typeof value === 'string' && value.trim() !== '',
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

const KEY_SUGGESTIONS = 3;

export {
  END_GROUP, KEY_SUGGESTIONS, MENU_GROUP_IDS, OVERRIDE_CHECKS, OVERRIDE_WANTS, VIEW_MARKER_GROUP, VIEW_MENU_KEY, VIEW_PLACE_FIELDS, WINDOW_FULLSCREEN_KEY, WINDOW_PIN_KEY,
};
