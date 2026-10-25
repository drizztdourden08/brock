/* @layer renderer-shell @kind logic */
import type { SideNavConfig, SideNavItem } from '@drizztdourden08/tessera/composites';
import type { HubGroup, HubPage } from '../../hub.type';

const buildHubNav = (home: HubPage | undefined, groups: readonly HubGroup[], highlight?: (page: string) => void): SideNavConfig => {
  const navItem = (page: HubPage): SideNavItem => ({ id: page.id, label: page.label, icon: page.icon, badge: page.badge, disabled: page.disabled, ...(highlight ? { onHighlight: () => highlight(page.id) } : {}) });
  return {
    ...(home ? { home: navItem(home) } : {}),
    groups: groups.map((group) => ({ id: group.id, label: group.label, items: group.pages.map(navItem) })),
  };
};

export { buildHubNav };
