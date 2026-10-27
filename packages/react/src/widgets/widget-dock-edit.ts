/* @layer renderer-shell @kind logic */
import { dockOnEdge, getWidgetDefinition, holdsMain, paneOf } from '@drizztdourden08/tessera/composites';
import type { LayoutNode, SnapSide, SplitAxis, SplitNode, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { DOCK_SIDES } from './widget-dock-edit.constants';
import type { WidgetDef } from './widget.type';
import type { WidgetDockOptions } from './widget-snapshot.type';

const stackAxis = (side: SnapSide): SplitAxis => (side === 'left' || side === 'right' ? 'column' : 'row');

const parentOf = (node: LayoutNode, key: string): SplitNode | null => {
  if (node.kind !== 'split') return null;
  if (node.children.some((child) => child.kind === 'pane' && child.key === key)) return node;
  for (const child of node.children) {
    const found = parentOf(child, key);
    if (found) return found;
  }
  return null;
};

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

const checkDock = (options: WidgetDockOptions): void => {
  if (!DOCK_SIDES.includes(options.side)) throw new Error(`Unknown side "${String(options.side)}". Use left, right, top or bottom.`);
  if (options.size !== undefined && !(Number.isFinite(options.size) && options.size > 0)) throw new Error('size must be a positive number of pixels.');
  if (options.index !== undefined && !(Number.isInteger(options.index) && options.index >= 0)) throw new Error('index must be a whole number, 0 or more.');
};

const dockEdit = (layout: WidgetLayout, def: WidgetDef, options: WidgetDockOptions, definitions: readonly WidgetDef[]): WidgetLayout => {
  checkDock(options);
  const weightOf = (other: string): number | undefined => getWidgetDefinition(definitions, other)?.dockWeight;
  const docked = dockOnEdge(layout, def.id, options.side, { size: options.size, weight: def.dockWeight, weightOf });
  return options.index === undefined ? docked : { ...docked, dock: placeAt(docked.dock, def.id, options.side, options.index) };
};

export { dockEdit };
