/* @layer renderer-shell @kind logic */
import { END_GROUP, MENU_GROUP_IDS } from './menu-config.constants';
import type { MenuContainer, MenuForest, MenuGroupId, MenuNode } from './menu-config.type';
import type { MenuEntry, MenuItem } from './menu.type';
import { tidySeparators } from './tidy-separators';

const withoutPlacement = (item: MenuItem): MenuItem => {
  const { group, order, before, after, parent, children, ...rest } = item;
  return rest;
};

const emptied = (forest: MenuForest, node: MenuNode): boolean =>
  forest.lists.get(node)?.length === 0 && (forest.planted.get(node) ?? 0) > 0;

const grow = (forest: MenuForest, container: MenuContainer): MenuEntry[] =>
  (forest.lists.get(container) ?? []).flatMap((node): MenuEntry[] => {
    if (node.item === null) return ['separator'];
    if (emptied(forest, node)) return [];
    const base = withoutPlacement(node.item);
    const item = container === END_GROUP ? { ...base, group: END_GROUP } : base;
    return [forest.lists.has(node) ? { ...item, children: tidySeparators(grow(forest, node)) } : item];
  });

const growForest = (forest: MenuForest): MenuEntry[] => {
  const [main, sections, modules, end] = MENU_GROUP_IDS.map((id: MenuGroupId) => grow(forest, id));
  return tidySeparators([...(main ?? []), 'separator', ...(sections ?? []), 'separator', ...(modules ?? []), ...(end ?? [])]);
};

export { growForest };
