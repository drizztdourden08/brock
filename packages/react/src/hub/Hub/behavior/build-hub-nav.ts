/* @layer renderer-shell @kind logic */
import type { SideNavConfig, SideNavItem } from '@drizztdourden08/tessera/composites';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { HubGroup, HubPage } from '../../hub.type';
import { fallbackText } from '../../../i18n/fallback-text';
import { splitTopPages } from './split-top-pages';

const buildHubNav = (home: HubPage | undefined, groups: readonly HubGroup[], highlight?: (page: string) => void, top?: readonly string[], text: (value: Text) => string = fallbackText): SideNavConfig => {
  const navItem = (page: HubPage): SideNavItem => ({ id: page.id, label: text(page.label), icon: page.icon, badge: page.badge, disabled: page.disabled, ...(highlight ? { onHighlight: () => highlight(page.id) } : {}) });
  const split = splitTopPages(groups, top);
  return {
    ...(home ? { home: navItem(home) } : {}),
    ...(split.top.length > 0 ? { top: split.top.map(navItem) } : {}),
    groups: split.groups.map((group) => ({ id: group.id, label: group.label, items: group.pages.map(navItem) })),
  };
};

export { buildHubNav };
