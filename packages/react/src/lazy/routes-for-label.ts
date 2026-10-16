/* @layer renderer-shell @kind logic */
import { HUB_DEFS } from '../hub/hub.constants';
import type { MenuEntry, MenuItem } from '../menu/menu.type';
import { joinRoute } from '../navigation/join-route';
import type { ScreenRegistry } from '../screens/screen-registry.type';

const menuItems = (entries: readonly MenuEntry[]): MenuItem[] =>
  entries.flatMap((entry) => (entry === 'separator' ? [] : [entry, ...menuItems(entry.children ?? [])]));

const menuRoute = (item: MenuItem): string | null => item.screen ?? (item.bucket ? joinRoute(item.bucket, item.page, item.tab) : null);

const screenRoutes = (registry: ScreenRegistry, label: string): string[] =>
  registry.list().flatMap((screen) => {
    const hub = HUB_DEFS.get(screen);
    const own = screen.title === label ? [screen.id] : [];
    if (!hub) return own;
    const pages = [hub.home, ...hub.groups.flatMap((group) => group.pages)].filter((page) => page.label === label);
    return [...own, ...pages.map((page) => joinRoute(hub.id, page.id))];
  });

const routesForLabel = (label: string, menu: readonly MenuEntry[], registry: ScreenRegistry): string[] => {
  const fromMenu = menuItems(menu).filter((item) => item.label === label).map(menuRoute).filter((route): route is string => route !== null);
  return [...new Set([...fromMenu, ...screenRoutes(registry, label)])];
};

export { routesForLabel };
