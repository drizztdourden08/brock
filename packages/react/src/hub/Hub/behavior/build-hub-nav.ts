/* @layer renderer-shell @kind logic */
import type { SectionNavConfig, SectionNavItem } from '@drizztdourden08/tessera/composites';
import type { HubGroup, HubPage } from '../../hub.type';

const navItem = (page: HubPage): SectionNavItem => ({ id: page.id, label: page.label, icon: page.icon });

const buildHubNav = (home: HubPage, groups: readonly HubGroup[]): SectionNavConfig => ({
  home: navItem(home),
  groups: groups.map((group) => ({ id: group.id, label: group.label, items: group.pages.map(navItem) })),
});

export { buildHubNav };
