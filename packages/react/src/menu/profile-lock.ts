/* @layer renderer-shell @kind logic */
import { resolveRoute } from '../navigation/resolve-route';
import { routeAliases } from '../navigation/route-aliases';
import type { ScreenRegistry } from '../screens/screen-registry.type';

const profileLock = (registry: ScreenRegistry) => (route: string): boolean => {
  const { active } = resolveRoute(route, {}, routeAliases.get);
  const screen = registry.get(active);
  return screen !== undefined && screen.requiresProfile !== false;
};

export { profileLock };
