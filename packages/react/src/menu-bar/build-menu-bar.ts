/* @layer renderer-shell @kind logic */
import { hasItem } from './has-item';
import { menuBarNodes } from './menu-bar-nodes';
import type { BuiltMenu, MenuBarMenu, MenuBarView } from './menu-bar.type';

const buildMenuBar = (menus: readonly MenuBarMenu[], view: MenuBarView): BuiltMenu[] =>
  menus
    .map(({ id, label, entries }) => ({ id, label, nodes: menuBarNodes(entries, id, view) }))
    .filter(({ nodes }) => hasItem(nodes));

export { buildMenuBar };
