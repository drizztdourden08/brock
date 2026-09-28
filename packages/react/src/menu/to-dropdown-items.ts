/* @layer renderer-shell @kind logic */
import type { MenuEntry as DsMenuEntry, MenuItem as DsMenuItem } from '@drizztdourden08/tessera/composites';
import { menuIcon } from './menu-icon';
import type { MenuEntry, MenuItem } from './menu.type';
import type { MenuResolver } from './to-dropdown-items.type';

const toDropdownItem = (item: MenuItem, resolve: MenuResolver): DsMenuItem => {
  const { key, label, icon, description, disabled, checked, screen, onClick, children } = item;
  const pick = screen || onClick
    ? () => {
      resolve.closeMenu();
      if (screen) resolve.openScreen(screen);
      onClick?.();
    }
    : undefined;
  return {
    key,
    label,
    icon: menuIcon(icon),
    description,
    disabled,
    checked,
    onClick: pick,
    children: children
      ?.filter((child): child is MenuItem => child !== 'separator')
      .map((child) => toDropdownItem(child, resolve)),
  };
};

const toDropdownItems = (entries: readonly MenuEntry[], resolve: MenuResolver): DsMenuEntry[] =>
  entries.map((entry) => (entry === 'separator' ? entry : toDropdownItem(entry, resolve)));

export { toDropdownItems };
