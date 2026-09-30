/* @layer renderer-shell @kind logic */
import type { MenuEntry } from '../../menu/menu.type';
import { menuPathTo } from '../menu/menu-path-to';
import type { ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const menuReachChecks = (menu: readonly MenuEntry[], ids: readonly string[]): ReviewOutcome[] =>
  ids.map((id) => {
    const path = menuPathTo(menu, (item) => item.screen === id);
    return outcome(`${id}-in-menu`, path !== null, `"${id}" opens from the menu entry ${path?.join(' > ') ?? ''}`, `no menu entry opens "${id}"`);
  });

export { menuReachChecks };
