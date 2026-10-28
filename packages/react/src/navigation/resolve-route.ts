/* @layer renderer-shell @kind logic */
import { ROUTE_SEPARATOR } from './navigation.constants';
import type { ResolvedRoute, RouteAlias, ScreenParams } from './navigation.type';

const deepLink = (id: string, params: ScreenParams): ResolvedRoute => {
  const [active = id, section, ...rest] = id.split(ROUTE_SEPARATOR);
  if (section === undefined || section === '') return { active, params };
  const tab = rest.length === 0 ? undefined : rest.join(ROUTE_SEPARATOR);
  return { active, params: { ...params, section, tab } };
};

const throughAlias = (routed: ResolvedRoute): ResolvedRoute => (routed.active.includes(ROUTE_SEPARATOR) ? deepLink(routed.active, routed.params) : routed);

const resolveRoute = (id: string, params: ScreenParams, aliasOf: (name: string) => RouteAlias | undefined): ResolvedRoute => {
  const alias = aliasOf(id);
  if (alias) return throughAlias(alias(params));
  const link = deepLink(id, params);
  const head = link.active === id ? undefined : aliasOf(link.active);
  return head ? throughAlias(head(link.params)) : link;
};

export { resolveRoute };
