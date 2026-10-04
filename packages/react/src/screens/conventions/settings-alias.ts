/* @layer renderer-shell @kind logic */
import type { HubDef } from '../../hub/hub.type';
import { joinRoute } from '../../navigation/join-route';
import { ROUTE_SEPARATOR } from '../../navigation/navigation.constants';
import type { RouteAlias, ScreenParams } from '../../navigation/navigation.type';
import type { TabDef } from '../../settings/settings.type';

const withoutTab = (params: ScreenParams): ScreenParams =>
  Object.fromEntries(Object.entries(params).filter(([key]) => key !== 'tab'));

const tabRoute = (hub: HubDef, tab: string): string => (tab.includes(ROUTE_SEPARATOR) ? tab : joinRoute(hub.id, tab));

const firstSettingsPage = (hub: HubDef, tabs: readonly TabDef<object>[]): string => {
  const routes = new Set(tabs.map((tab) => tabRoute(hub, tab.id)));
  const pages = [hub.home, ...hub.groups.flatMap((group) => group.pages)];
  return pages.map((page) => joinRoute(hub.id, page.id)).find((route) => routes.has(route)) ?? hub.id;
};

const namedPage = (hub: HubDef, page: string | undefined): string | null =>
  (page !== undefined && [hub.home, ...hub.groups.flatMap((group) => group.pages)].some((candidate) => candidate.id === page) ? joinRoute(hub.id, page) : null);

const settingsAlias = (hub: HubDef, tabs: readonly TabDef<object>[], page?: string): RouteAlias => {
  const first = namedPage(hub, page) ?? firstSettingsPage(hub, tabs);
  return (params) => ({
    active: typeof params.tab === 'string' ? tabRoute(hub, params.tab) : first,
    params: withoutTab(params),
  });
};

export { settingsAlias };
