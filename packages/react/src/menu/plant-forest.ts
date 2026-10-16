/* @layer renderer-shell @kind logic */
import { MENU_GROUP_IDS } from './menu-config.constants';
import type { MenuContainer, MenuForest, MenuGroups, MenuNode } from './menu-config.type';
import type { MenuEntry } from './menu.type';

const plant = (forest: MenuForest, entries: readonly MenuEntry[], container: MenuContainer): void => {
  const list = entries.map((entry): MenuNode => {
    const node: MenuNode = { item: entry === 'separator' ? null : entry, container, override: {} };
    if (entry === 'separator') return node;
    forest.nodes.push(node);
    if (!forest.byKey.has(entry.key)) forest.byKey.set(entry.key, node);
    if (entry.children) plant(forest, entry.children, node);
    return node;
  });
  forest.lists.set(container, list);
  forest.planted.set(container, list.length);
};

const plantForest = (groups: MenuGroups): MenuForest => {
  const forest: MenuForest = { lists: new Map(), planted: new Map(), byKey: new Map(), nodes: [] };
  for (const id of MENU_GROUP_IDS) plant(forest, groups[id], id);
  return forest;
};

export { plantForest };
