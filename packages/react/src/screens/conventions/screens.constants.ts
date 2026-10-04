/* @layer renderer-shell @kind constants */
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { ScreenEntry } from './screen-tree.type';

const KIND_ICONS: Record<ScreenEntry['kind'], IconName> = {
  hero: 'house',
  page: 'file-text',
  tab: 'layout-list',
  'page-meta': 'layout-list',
  settings: 'settings',
  card: 'file',
  custom: 'puzzle',
  layer: 'layers',
};

const HOME_LABEL = 'Home';
const SETTINGS_ALIAS = 'settings';
const SETTINGS_SHORTCUT = 'Mod+Comma';
const SETTINGS_GROUP_PREFIX = 'settings-';
const BUCKET_KEY_PREFIX = 'bucket:';
const SCREEN_KEY_PREFIX = 'screen:';
const BUILT_IN_SCREEN_IDS: readonly string[] = ['profiles', 'settings', 'about', 'credits'];
const UNORDERED = Number.POSITIVE_INFINITY;

export {
  BUCKET_KEY_PREFIX, BUILT_IN_SCREEN_IDS, HOME_LABEL, KIND_ICONS, SCREEN_KEY_PREFIX, SETTINGS_ALIAS, SETTINGS_GROUP_PREFIX, SETTINGS_SHORTCUT,
  UNORDERED,
};
