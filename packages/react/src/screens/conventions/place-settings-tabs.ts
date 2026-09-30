/* @layer renderer-shell @kind logic */
import type { HubDef, HubGroup } from '../../hub/hub.type';
import { settingsTabPage } from '../../hub/settings-tab-page';
import type { TabDef } from '../../settings/settings.type';
import { SETTINGS_GROUP_PREFIX } from './screens.constants';

const settingsGroups = (tabs: readonly TabDef<object>[]): HubGroup[] =>
  [...new Set(tabs.map((tab) => tab.group))].map((group) => ({
    id: `${SETTINGS_GROUP_PREFIX}${group.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    label: group,
    pages: tabs.filter((tab) => tab.group === group).map((tab) => settingsTabPage(tab)),
  }));

const placeSettingsTabs = (hub: HubDef, tabs: readonly TabDef<object>[]): HubDef =>
  tabs.length === 0 ? hub : { ...hub, groups: [...hub.groups, ...settingsGroups(tabs)] };

export { placeSettingsTabs };
