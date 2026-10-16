/* @layer renderer-shell @kind logic */
import type { MenuContainer, MenuForest, MenuGroupId, MenuNode } from './menu-config.type';

const detach = (forest: MenuForest, node: MenuNode): void => {
  const list = forest.lists.get(node.container) ?? [];
  const at = list.indexOf(node);
  if (at !== -1) list.splice(at, 1);
};

const attach = (forest: MenuForest, node: MenuNode, container: MenuContainer, at?: number): void => {
  detach(forest, node);
  const list = forest.lists.get(container) ?? [];
  if (at === undefined) list.push(node);
  else list.splice(at, 0, node);
  forest.lists.set(container, list);
  node.container = container;
};

const beside = (forest: MenuForest, node: MenuNode, anchor: MenuNode, after: boolean): void => {
  detach(forest, node);
  const list = forest.lists.get(anchor.container) ?? [];
  attach(forest, node, anchor.container, list.indexOf(anchor) + (after ? 1 : 0));
};

const topGroupOf = (node: MenuNode): MenuGroupId => {
  let container = node.container;
  while (typeof container !== 'string') container = container.container;
  return container;
};

const isInside = (node: MenuNode, outer: MenuNode): boolean => {
  let container: MenuContainer = node.container;
  while (typeof container !== 'string') {
    if (container === outer) return true;
    container = container.container;
  }
  return false;
};

const menuMoves = { attach, beside, isInside, topGroupOf };

export { menuMoves };
