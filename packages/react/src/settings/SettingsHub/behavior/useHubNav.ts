/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { FormFactor } from '@drizztdourden08/brock-core';
import { groupKey } from '../../group-key';
import type { TabDef } from '../../settings.type';
import type { HubNavGroup, HubNavModel } from '../SettingsHub.type';

const navItem = <S extends object>(tab: TabDef<S>) => ({ id: tab.id, label: tab.label, icon: tab.navIcon });

const groupOf = <S extends object>(groups: readonly HubNavGroup<S>[], tab: TabDef<S>): HubNavGroup<S> | undefined =>
  groups.find((group) => tab.groupId !== undefined && group.id === tab.groupId) ?? groups.find((group) => groupKey(group.label) === groupKey(tab.group));

const useHubNav = <S extends object>(
  tabs: readonly TabDef<S>[],
  formFactor: FormFactor,
  homeTabId?: string,
): HubNavModel<S> => useMemo(() => {
  const listed = tabs.filter((tab) => !tab.mobileOnly || formFactor === 'mobile');
  const home = listed.find((tab) => tab.id === homeTabId) ?? listed.at(0) ?? null;
  const grouped = listed.filter((tab) => tab !== home);

  const groups: HubNavGroup<S>[] = [];
  for (const tab of grouped) {
    const group = groupOf(groups, tab);
    if (group) group.items.push(tab);
    else groups.push({ id: tab.groupId ?? tab.group, label: tab.group, items: [tab] });
  }

  return {
    navConfig: {
      home: home ? navItem(home) : undefined,
      groups: groups.map((group) => ({ id: group.id, label: group.label, items: group.items.map(navItem) })),
    },
    visibleTabs: home ? [home, ...grouped] : grouped,
    home,
  };
}, [tabs, formFactor, homeTabId]);

export { useHubNav };
