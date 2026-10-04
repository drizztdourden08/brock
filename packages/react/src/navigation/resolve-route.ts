/* @layer renderer-shell @kind logic */
import { ROUTE_SEPARATOR } from './navigation.constants';
import type { ResolvedRoute, RouteAlias, ScreenParams } from './navigation.type';

const deepLink = (id: string, params: ScreenParams): ResolvedRoute => {
  const [active = id, section, ...rest] = id.split(ROUTE_SEPARATOR);
  if (section === undefined || section === '') return { active, params };
  const tab = rest.length === 0 ? undefined : rest.join(ROUTE_SEPARATOR);
  return { active, params: { ...params, section, tab } };
};

const resolveRoute = (id: string, params: ScreenParams, aliasOf: (name: string) => RouteAlias | undefined): ResolvedRoute => {
  const alias = aliasOf(id);
  if (!alias) return deepLink(id, params);
  const routed = alias(params);
  return routed.active.includes(ROUTE_SEPARATOR) ? deepLink(routed.active, routed.params) : routed;
};

export { resolveRoute };
