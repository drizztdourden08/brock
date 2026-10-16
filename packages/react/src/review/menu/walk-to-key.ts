/* @layer renderer-shell @kind logic */
import type { MenuEntry } from '../../menu/menu.type';
import type { MenuKeyWalk } from '../review.type';
import { menuPathTo } from './menu-path-to';
import { walkMenu } from './walk-menu';

const walkToKey = async (menu: readonly MenuEntry[], key: string): Promise<MenuKeyWalk> => {
  const path = menuPathTo(menu, (item) => item.key === key);
  const last = path?.at(-1);
  const item = path && last !== undefined ? await walkMenu(path.slice(0, -1), last) : null;
  return { path, item };
};

export { walkToKey };
