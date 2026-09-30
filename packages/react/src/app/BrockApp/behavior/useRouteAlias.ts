/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { RouteAlias } from '../../../navigation/navigation.type';
import { routeAliases } from '../../../navigation/route-aliases';

const useRouteAlias = (name: string, alias: RouteAlias | null): void => {
  useEffect(() => (alias ? routeAliases.add(name, alias) : undefined), [name, alias]);
};

export { useRouteAlias };
