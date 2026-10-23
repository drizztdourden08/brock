/* @layer renderer-shell @kind types */
import type { MenuBarMenu } from '../menu-bar.type';

interface MenuBarProps {
  menus: readonly MenuBarMenu[];
}

export type { MenuBarProps };
