/* @layer renderer-shell @kind logic */
import type { MenuForest, MenuIssue, MenuNode, MenuPass } from './menu-config.type';
import { menuMoves } from './menu-moves';

const keyOf = (node: MenuNode): string => node.item?.key ?? '';

const submenuFor = (pass: MenuPass, node: MenuNode, parent: string): MenuNode | null => {
  const target = pass.forest.byKey.get(parent);
  const key = keyOf(node);
  if (target === undefined) {
    if (!pass.known.has(parent)) pass.issues.push({ key, message: `the menu entry "${key}" names the parent "${parent}", which no menu entry has as its key` });
    return null;
  }
  if (!pass.forest.lists.has(target)) {
    pass.issues.push({ key, message: `the menu entry "${key}" names the parent "${parent}", which is not a submenu` });
    return null;
  }
  if (target === node || menuMoves.isInside(target, node)) {
    pass.issues.push({ key, message: `the menu entry "${key}" cannot sit inside "${parent}", which is itself or sits inside it` });
    return null;
  }
  return target;
};

const applyParent = (pass: MenuPass, node: MenuNode): void => {
  const { parent, group } = node.override;
  if (typeof parent === 'string') {
    const target = submenuFor(pass, node, parent);
    if (target !== null && node.container !== target) menuMoves.attach(pass.forest, node, target);
    return;
  }
  if (parent === undefined && group === undefined) return;
  const band = group ?? menuMoves.topGroupOf(node);
  if (node.container !== band) menuMoves.attach(pass.forest, node, band);
};

const applyParents = (forest: MenuForest, known: ReadonlySet<string>, issues: MenuIssue[]): void => {
  const pass: MenuPass = { forest, known, issues };
  for (const node of forest.nodes) applyParent(pass, node);
};

export { applyParents };
