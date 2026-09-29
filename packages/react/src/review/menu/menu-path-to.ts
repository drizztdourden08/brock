/* @layer renderer-shell @kind logic */
import type { MenuEntry, MenuItem } from '../../menu/menu.type';
import { isMenuItem } from './is-menu-item';

const menuPathTo = (menu: readonly MenuEntry[], match: (item: MenuItem) => boolean): string[] | null => {
  const items = menu.filter(isMenuItem);
  const direct = items.find(match);
  if (direct) return [direct.label];
  for (const item of items) {
    const below = item.children ? menuPathTo(item.children, match) : null;
    if (below) return [item.label, ...below];
  }
  return null;
};

export { menuPathTo };
