/* @layer renderer-shell @kind logic */
import type { HubDef, HubPage } from '../hub/hub.type';
import { isShown } from '../screens/show/is-shown';
import type { ShowContext } from '../screens/show/show.type';
import { joinRoute } from './join-route';
import type { NavRoute } from './nav-routes.type';

const pageRoutes = (hub: HubDef, page: HubPage): NavRoute[] => {
  const route = joinRoute(hub.id, page.id);
  const base = { screen: hub.id, section: page.id };
  return [
    { ...base, route, title: page.label, kind: 'page', tab: null },
    ...(page.tabs ?? []).map((tab): NavRoute => ({ ...base, route: joinRoute(hub.id, page.id, tab.id), title: tab.label, kind: 'tab', tab: tab.id })),
    ...(page.subs ?? []).map((sub): NavRoute => ({ ...base, route: joinRoute(hub.id, page.id, sub.path), title: sub.label, kind: 'sub', tab: sub.path })),
  ];
};

const hubRoutes = (hub: HubDef, developerTools: boolean, show: ShowContext): NavRoute[] => {
  if (!isShown(hub.show, show)) return [];
  const pages = [hub.home, ...hub.groups.flatMap((group) => group.pages)]
    .filter((page) => (page.devOnly !== true || developerTools) && isShown(page.show, show));
  return [
    { route: hub.id, title: hub.title, kind: 'hub', screen: hub.id, section: null, tab: null },
    ...pages.flatMap((page) => pageRoutes(hub, page)),
  ];
};

export { hubRoutes };
