/* @layer renderer-shell @kind logic */
import { resolveRoute } from '../../../navigation/resolve-route';
import { routeAliases } from '../../../navigation/route-aliases';
import type { ResolvedScreenTree } from '../../../screens/conventions/screen-tree.type';
import type { ScreenRegistry } from '../../../screens/screen-registry.type';

const routeLabel = (tree: ResolvedScreenTree | null, registry: ScreenRegistry) => (target: string): string => {
  const entry = tree?.search.find((item) => item.target?.route === target && item.target.anchor === undefined);
  if (entry) return entry.label;
  return registry.get(resolveRoute(target, {}, routeAliases.get).active)?.title ?? target;
};

export { routeLabel };
