/* @layer renderer-shell @kind logic */
import type { RouteAlias, RouteAliasRegistry } from './navigation.type';

const aliases = new Map<string, RouteAlias>();

const routeAliases: RouteAliasRegistry = {
  add: (name, alias) => {
    aliases.set(name, alias);
    return () => {
      if (aliases.get(name) === alias) aliases.delete(name);
    };
  },
  get: (name) => aliases.get(name),
};

export { routeAliases };
