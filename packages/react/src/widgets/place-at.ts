/* @layer renderer-shell @kind logic */
import { holdsMain, paneOf } from '@drizztdourden08/tessera/composites';
import type { LayoutNode, SnapSide, SplitNode } from '@drizztdourden08/tessera/composites';
import { parentOf } from './parent-of';
import { stackAxis } from './stack-axis';

const replaced = (node: LayoutNode, target: SplitNode, next: SplitNode): LayoutNode => {
  if (node === target) return next;
  return node.kind === 'split' ? { ...node, children: node.children.map((child) => replaced(child, target, next)) } : node;
};

const moved = <T>(list: readonly T[], from: number, to: number): T[] => {
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  if (item !== undefined) copy.splice(to, 0, item);
  return copy;
};

const placeAt = (dock: LayoutNode, id: string, side: SnapSide, index: number): LayoutNode => {
  const key = paneOf(dock, id)?.key ?? '';
  const parent = parentOf(dock, key);
  if (parent?.axis !== stackAxis(side) || holdsMain(parent)) return dock;
  const from = parent.children.findIndex((child) => child.kind === 'pane' && child.key === key);
  const to = Math.min(index, parent.children.length - 1);
  if (from === to) return dock;
  return replaced(dock, parent, { ...parent, children: moved(parent.children, from, to), sizes: moved(parent.sizes, from, to) });
};

export { placeAt };
