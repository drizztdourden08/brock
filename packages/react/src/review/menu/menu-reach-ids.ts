/* @layer renderer-shell @kind logic */
import type { ResolvedScreenTree } from '../../screens/conventions/screen-tree.type';
import { isShown } from '../../screens/show/is-shown';
import { NO_ROUTES } from '../review.constants';

const menuReachIds = (tree: Pick<ResolvedScreenTree, 'base' | 'hubs' | 'screens'>, hidden: ReadonlySet<string> = NO_ROUTES): string[] => {
  const hubIds = tree.hubs.map((hub) => hub.id);
  return tree.screens
    .filter((screen) => screen.id !== tree.base && screen.menu !== false && !hubIds.includes(screen.id) && !hidden.has(screen.id) && isShown(screen.show))
    .map((screen) => screen.id);
};

export { menuReachIds };
