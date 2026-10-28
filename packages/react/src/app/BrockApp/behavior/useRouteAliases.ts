/* @layer renderer-shell @kind hook */
import { useLayoutEffect } from 'react';
import type { ResolvedScreenTree } from '../../../screens/conventions/screen-tree.type';
import { SETTINGS_ALIAS } from '../../../screens/conventions/screens.constants';
import { routeAliases } from '../../../navigation/route-aliases';

const useRouteAliases = (tree: ResolvedScreenTree | null): void => {
  useLayoutEffect(() => {
    if (tree === null) return undefined;
    const aliases = { ...tree.aliases, [SETTINGS_ALIAS]: tree.settingsAlias };
    const removers = Object.entries(aliases).map(([name, alias]) => routeAliases.add(name, alias));
    return () => removers.forEach((remove) => remove());
  }, [tree]);
};

export { useRouteAliases };
