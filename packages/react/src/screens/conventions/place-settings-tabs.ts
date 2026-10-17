/* @layer renderer-shell @kind logic */
import type { HubDef, HubGroup } from '../../hub/hub.type';
import { settingsTabPage } from '../../hub/settings-tab-page';
import { groupKey } from '../../settings/group-key';
import type { TabDef } from '../../settings/settings.type';
import { SETTINGS_GROUP_PREFIX } from './screens.constants';

const groupIndex = (groups: readonly HubGroup[], tab: TabDef<object>): number => {
  const byId = tab.groupId === undefined ? -1 : groups.findIndex((group) => group.id === tab.groupId);
  return byId === -1 ? groups.findIndex((group) => groupKey(group.label) === groupKey(tab.group)) : byId;
};

const newGroupId = (tab: TabDef<object>): string =>
  tab.groupId ?? `${SETTINGS_GROUP_PREFIX}${tab.group.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const placeTab = (groups: readonly HubGroup[], tab: TabDef<object>): HubGroup[] => {
  const page = settingsTabPage(tab);
  const index = groupIndex(groups, tab);
  if (index === -1) return [...groups, { id: newGroupId(tab), label: tab.group, pages: [page] }];
  return groups.map((group, at) => (at === index ? { ...group, pages: [...group.pages, page] } : group));
};

const placeSettingsTabs = (hub: HubDef, tabs: readonly TabDef<object>[]): HubDef =>
  tabs.length === 0 ? hub : { ...hub, groups: tabs.reduce(placeTab, hub.groups) };

export { placeSettingsTabs };
