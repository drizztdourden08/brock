/* @layer renderer-shell @kind logic */
import type { MenuGroup, MenuItem as TesseraMenuItem, MenuNode } from '@drizztdourden08/tessera/composites';
import { menuItemIcon } from './menu-item-icon';
import { menuShortcut } from './menu-shortcut';
import { MENU_GROUP_ID, MENU_SEPARATOR } from './menu.constants';
import type { MenuEntry, MenuItem } from './menu.type';
import type { MenuResolver } from './to-menu-groups.type';

const selectOf = (item: MenuItem, resolve: MenuResolver): (() => void) | undefined => {
  const { screen, onClick } = item;
  if (!screen && !onClick) return undefined;
  return () => {
    if (screen) resolve.openScreen(screen);
    onClick?.();
  };
};

const toMenuItem = (item: MenuItem, resolve: MenuResolver): TesseraMenuItem => {
  const { key, label, icon, description, shortcut, disabled, checked, children } = item;
  return {
    id: key,
    label,
    icon: menuItemIcon(icon),
    description,
    shortcut: shortcut === undefined ? undefined : menuShortcut(shortcut),
    disabled,
    checked,
    onSelect: selectOf(item, resolve),
    children: children && toMenuNodes(children, resolve),
  };
};

const toMenuNodes = (entries: readonly MenuEntry[], resolve: MenuResolver): MenuNode[] =>
  entries.map((entry) => (entry === 'separator' ? MENU_SEPARATOR : toMenuItem(entry, resolve)));

const toMenuGroups = (entries: readonly MenuEntry[], resolve: MenuResolver): MenuGroup[] =>
  [{ id: MENU_GROUP_ID, items: toMenuNodes(entries, resolve) }];

export { toMenuGroups };
