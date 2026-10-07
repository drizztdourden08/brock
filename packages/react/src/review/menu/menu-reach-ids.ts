/* @layer renderer-shell @kind logic */
import type { ResolvedScreenTree } from '../../screens/conventions/screen-tree.type';

const menuReachIds = (tree: Pick<ResolvedScreenTree, 'base' | 'hubs' | 'screens'>): string[] => {
  const hubIds = tree.hubs.map((hub) => hub.id);
  return tree.screens
    .filter((screen) => screen.id !== tree.base && screen.menu !== false && !hubIds.includes(screen.id))
    .map((screen) => screen.id);
};

export { menuReachIds };
