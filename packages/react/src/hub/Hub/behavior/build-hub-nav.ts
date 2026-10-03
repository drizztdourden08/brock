/* @layer renderer-shell @kind logic */
import type { SideNavConfig, SideNavItem } from '@drizztdourden08/tessera/composites';
import type { HubGroup, HubPage } from '../../hub.type';

const navItem = (page: HubPage): SideNavItem => ({ id: page.id, label: page.label, icon: page.icon });

const buildHubNav = (home: HubPage, groups: readonly HubGroup[]): SideNavConfig => ({
  home: navItem(home),
  groups: groups.map((group) => ({ id: group.id, label: group.label, items: group.pages.map(navItem) })),
});

export { buildHubNav };
