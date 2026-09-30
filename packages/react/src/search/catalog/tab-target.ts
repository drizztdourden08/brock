/* @layer renderer-shell @kind logic */
import { joinRoute } from '../../navigation/join-route';
import { ROUTE_SEPARATOR } from '../../navigation/navigation.constants';
import type { TabDef } from '../../settings/settings.type';
import { SETTINGS_SCREEN } from '../search.constants';
import type { SearchTarget, SettingsPlace } from '../search.type';

const tabTarget = (tab: TabDef<object>, place: SettingsPlace, anchor?: string): SearchTarget => {
  const at = anchor === undefined ? {} : { anchor };
  if (place.bucket === null) return { route: SETTINGS_SCREEN, params: { tab: tab.id }, ...at };
  return { route: tab.id.includes(ROUTE_SEPARATOR) ? tab.id : joinRoute(place.bucket, tab.id), ...at };
};

export { tabTarget };
