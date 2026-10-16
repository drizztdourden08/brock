/* @layer renderer-shell @kind logic */
import type { MenuAnchorPass, MenuForest, MenuIssue, MenuNode } from './menu-config.type';
import { menuMoves } from './menu-moves';

const keyOf = (node: MenuNode): string => node.item?.key ?? '';

const anchorKeyOf = (node: MenuNode): string | undefined => node.override.before ?? node.override.after;

const anchorFor = (pass: MenuAnchorPass, node: MenuNode, wanted: string): MenuNode | null => {
  const anchor = pass.forest.byKey.get(wanted);
  const key = keyOf(node);
  if (anchor === undefined) {
    if (!pass.known.has(wanted)) pass.issues.push({ key, message: `the menu entry "${key}" is placed beside "${wanted}", which no menu entry has as its key` });
    return null;
  }
  if (anchor === node || menuMoves.isInside(anchor, node)) {
    pass.issues.push({ key, message: `the menu entry "${key}" cannot be placed beside "${wanted}", which is itself or sits inside it` });
    return null;
  }
  return anchor;
};

const markLoop = (pass: MenuAnchorPass, node: MenuNode): void => {
  const loop = pass.stack.slice(pass.stack.indexOf(node));
  const keys = [...loop, node].map(keyOf).join(' > ');
  for (const member of loop) pass.looped.add(member);
  pass.issues.push({ key: keyOf(node), message: `the menu entries ${keys} name each other in before and after, so none of them moves` });
};

const place = (pass: MenuAnchorPass, node: MenuNode): void => {
  if (pass.done.has(node)) return;
  if (pass.stack.includes(node)) {
    markLoop(pass, node);
    return;
  }
  const wanted = anchorKeyOf(node);
  const anchor = wanted === undefined ? null : anchorFor(pass, node, wanted);
  pass.stack.push(node);
  if (anchor !== null && anchorKeyOf(anchor) !== undefined) place(pass, anchor);
  pass.stack.pop();
  pass.done.add(node);
  if (anchor !== null && !pass.looped.has(node)) menuMoves.beside(pass.forest, node, anchor, node.override.before === undefined);
};

const bothSides = (node: MenuNode): MenuIssue => ({
  key: keyOf(node),
  message: `the menu entry "${keyOf(node)}" sets both before and after; before is used`,
});

const applyAnchors = (forest: MenuForest, known: ReadonlySet<string>, issues: MenuIssue[]): void => {
  const pass: MenuAnchorPass = { forest, known, issues, done: new Set(), stack: [], looped: new Set() };
  for (const node of forest.nodes) {
    if (node.override.before !== undefined && node.override.after !== undefined) issues.push(bothSides(node));
    if (anchorKeyOf(node) !== undefined) place(pass, node);
  }
};

export { applyAnchors };
