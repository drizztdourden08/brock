/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { TabDef } from '../../settings/settings.type';
import type { SettingsPlace } from '../search.type';

const tabCrumbs = (tab: TabDef<object>, place: SettingsPlace, text: (value: Text) => string): string[] => {
  const group = text(tab.group);
  return place.bucket === null || group === place.bucket ? [place.title] : [place.title, group];
};

export { tabCrumbs };
