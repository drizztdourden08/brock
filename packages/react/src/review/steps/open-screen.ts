/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { menuPathTo } from '../menu/menu-path-to';
import { pickMenuPath } from '../menu/pick-menu-path';
import type { ReviewEnv } from '../review.type';

const openScreen = async (env: ReviewEnv, id: string): Promise<string> => {
  const path = menuPathTo(env.menu, (item) => item.screen === id);
  if (path && await pickMenuPath(path)) return `the menu entry ${path.join(' > ')}`;
  nav.open(id);
  return 'nav.open, since no menu entry opens it';
};

export { openScreen };
