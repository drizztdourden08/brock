/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { FormFactor } from '@drizztdourden08/brock-core';
import type { TabDef } from '../../settings.type';
import type { HubNavModel } from '../SettingsHub.type';

const navItem = <S extends object>(tab: TabDef<S>) => ({ id: tab.id, label: tab.label, icon: tab.navIcon });

const useHubNav = <S extends object>(
  tabs: readonly TabDef<S>[],
  formFactor: FormFactor,
  homeTabId?: string,
): HubNavModel<S> => useMemo(() => {
  const listed = tabs.filter((tab) => !tab.mobileOnly || formFactor === 'mobile');
  const home = listed.find((tab) => tab.id === homeTabId) ?? listed.at(0) ?? null;
  const grouped = listed.filter((tab) => tab !== home);

  const groups: { id: string; label: string; items: TabDef<S>[] }[] = [];
  for (const tab of grouped) {
    const group = groups.find((g) => g.label === tab.group);
    if (group) group.items.push(tab);
    else groups.push({ id: tab.group, label: tab.group, items: [tab] });
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
