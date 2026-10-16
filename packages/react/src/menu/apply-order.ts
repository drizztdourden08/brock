/* @layer renderer-shell @kind logic */
import type { MenuForest, MenuNode } from './menu-config.type';

const orderOf = (node: MenuNode): number => node.override.order ?? 0;

const applyOrder = (forest: MenuForest): void => {
  for (const [container, list] of forest.lists) {
    if (list.some((node) => node.override.order !== undefined)) forest.lists.set(container, [...list].sort((a, b) => orderOf(a) - orderOf(b)));
  }
};

export { applyOrder };
