/* @layer renderer-shell @kind logic */
import { HUB_DEFS } from '../../hub/hub.constants';
import type { ScreenRegistry } from '../screen-registry.type';
import { hiddenRoutes } from './hidden-routes';
import { routeHidden } from './route-hidden';

const routeHiddenNow = (route: string, registry: ScreenRegistry): boolean => {
  const screens = registry.list();
  const hubs = screens.flatMap((screen) => {
    const def = HUB_DEFS.get(screen);
    return def ? [def] : [];
  });
  return routeHidden(route, hiddenRoutes(hubs, screens));
};

export { routeHiddenNow };
