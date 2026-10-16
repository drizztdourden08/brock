/* @layer renderer-shell @kind logic */
import { joinRoute } from '../navigation/join-route';
import { resolveRoute } from '../navigation/resolve-route';
import { routeAliases } from '../navigation/route-aliases';
import type { ScreenRegistry } from '../screens/screen-registry.type';
import { preloadRoute } from './preload-route';

const textOf = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined);

const routePreloader = (registry: ScreenRegistry) => (route: string): void => {
  const { active, params } = resolveRoute(route, {}, routeAliases.get);
  preloadRoute(registry, joinRoute(active, textOf(params.section), textOf(params.tab)));
};

export { routePreloader };
