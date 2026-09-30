/* @layer renderer-shell @kind logic */
import type { TabDef } from '../../settings/settings.type';
import type { SettingsPlace } from '../search.type';

const tabCrumbs = (tab: TabDef<object>, place: SettingsPlace): string[] =>
  place.bucket === null || tab.group === place.bucket ? [place.title] : [place.title, tab.group];

export { tabCrumbs };
