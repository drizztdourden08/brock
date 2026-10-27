/* @layer renderer-shell @kind logic */
import { controlSources } from '../app/control-sources';
import { developerToolsOn } from '../developer-tools/developer-tools-on';
import { isScreenAllowed } from '../screens/is-screen-allowed';
import { currentShowContext } from '../screens/show/current-show-context';
import { useProfilesStore } from '../stores/useProfilesStore';
import { hubRoutes } from './hub-routes';
import type { NavRoute } from './nav-routes.type';

const navRoutes = (): NavRoute[] => {
  const { screens, tree } = controlSources.get();
  if (screens === null) return [];
  const developerOn = developerToolsOn();
  const hasProfile = useProfilesStore.getState().active !== null;
  const show = currentShowContext();
  const routes = new Map<string, NavRoute>();
  for (const screen of screens.list().filter((candidate) => isScreenAllowed(candidate, developerOn, hasProfile, show))) {
    routes.set(screen.id, { route: screen.id, title: screen.title, kind: 'screen', screen: screen.id, section: null, tab: null });
  }
  for (const route of (tree?.hubs ?? []).flatMap((hub) => hubRoutes(hub, developerOn, show))) routes.set(route.route, route);
  return [...routes.values()];
};

export { navRoutes };
