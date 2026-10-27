/* @layer renderer-shell @kind logic */
import { GAP, floatingRect, holdsMain, layoutTree, placementOf, toFloating, widgetsIn } from '@drizztdourden08/tessera/composites';
import type { LayoutNode, SplitAxis, SplitNode, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { checkRect } from './widget-check-rect';
import { floatArea } from './widget-float-area';
import { MAX_SHARE, MIN_SHARE } from './widget-resize-edit.constants';
import type { ResizeStep } from './widget-resize-edit.type';
import { widgetSideOf } from './widget-side-of';
import type { WidgetFloatRect } from './widget-snapshot.type';
import { stageRect } from './widget-stage-rect';

const ancestry = (node: LayoutNode, id: string): ResizeStep[] => {
  if (node.kind !== 'split') return [];
  const at = node.children.findIndex((child) => widgetsIn(child).includes(id));
  const next = node.children[at];
  return at < 0 || !next ? [] : [{ split: node, at }, ...ancestry(next, id)];
};

const withSizes = (node: LayoutNode, target: SplitNode, sizes: number[]): LayoutNode => {
  if (node === target) return { ...target, sizes };
  return node.kind === 'split' ? { ...node, children: node.children.map((child) => withSizes(child, target, sizes)) } : node;
};

const sharesOf = (step: ResizeStep, size: number, along: number): number[] => {
  const { split, at } = step;
  const free = Math.max(1, along - GAP * (split.children.length - 1));
  const total = split.sizes.reduce((sum, each) => sum + each, 0) || 1;
  const share = Math.min(MAX_SHARE, Math.max(MIN_SHARE, size / free));
  const rest = total - (split.sizes[at] ?? 0);
  return split.sizes.map((each, index) => {
    if (index === at) return share * total;
    return (rest > 0 ? each / rest : 1 / Math.max(1, split.sizes.length - 1)) * total * (1 - share);
  });
};

const axisFor = (side: string | null): SplitAxis => (side === 'left' || side === 'right' ? 'row' : 'column');

const resizeDocked = (layout: WidgetLayout, id: string, size: number): WidgetLayout => {
  if (!(Number.isFinite(size) && size > 0)) throw new Error('size must be a positive number of pixels.');
  const axis = axisFor(widgetSideOf(layout.dock, id));
  const step = ancestry(layout.dock, id).reverse().find((each) => each.split.axis === axis && !holdsMain(each.split.children[each.at] ?? layout.dock));
  const along = step ? layoutTree(layout.dock, stageRect()).dividers.find((divider) => divider.node === step.split)?.along : undefined;
  if (!step || along === undefined) throw new Error(`Widget "${id}" has no resizable edge.`);
  return { ...layout, dock: withSizes(layout.dock, step.split, sharesOf(step, size, along)) };
};

const resizeFloating = (layout: WidgetLayout, id: string, rect: WidgetFloatRect): WidgetLayout => {
  checkRect(rect);
  const main = floatArea();
  return {
    ...layout,
    floating: layout.floating.map((entry) => (entry.id === id ? toFloating(id, { ...floatingRect(entry, main), ...rect }, main) : entry)),
  };
};

const resizeEdit = (layout: WidgetLayout, id: string, to: number | WidgetFloatRect): WidgetLayout => {
  const placement = placementOf(layout, id);
  if (placement === null) throw new Error(`Widget "${id}" is not open. Open or dock it first.`);
  if (placement === 'popped') throw new Error(`Widget "${id}" is in its own window. Dock or float it first.`);
  if (placement === 'docked') {
    if (typeof to !== 'number') throw new Error(`Widget "${id}" is docked. Pass a size in pixels, or float it first.`);
    return resizeDocked(layout, id, to);
  }
  if (typeof to === 'number') throw new Error(`Widget "${id}" is floating. Pass a rect with width and height.`);
  return resizeFloating(layout, id, to);
};

export { resizeEdit };
