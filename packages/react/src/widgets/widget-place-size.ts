/* @layer renderer-shell @kind logic */
import { GAP } from '@drizztdourden08/tessera/composites';
import type { LayoutNode, SplitNode, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { edgeStepOf } from './widget-edge-step';
import type { ResizeStep, SizedLayout } from './widget-resize-edit.type';
import { shareLimit } from './widget-share-limit';

const withSizes = (node: LayoutNode, target: SplitNode, sizes: number[]): LayoutNode => {
  if (node === target) return { ...target, sizes };
  return node.kind === 'split' ? { ...node, children: node.children.map((child) => withSizes(child, target, sizes)) } : node;
};

const sharesOf = ({ split, at }: ResizeStep, share: number): number[] => {
  const total = split.sizes.reduce((sum, each) => sum + each, 0) || 1;
  const rest = total - (split.sizes[at] ?? 0);
  return split.sizes.map((each, index) => {
    if (index === at) return share * total;
    return (rest > 0 ? each / rest : 1 / Math.max(1, split.sizes.length - 1)) * total * (1 - share);
  });
};

const placeSize = (layout: WidgetLayout, id: string, size: number): SizedLayout | undefined => {
  const found = edgeStepOf(layout, id);
  if (!found) return undefined;
  const { step, along } = found;
  const free = Math.max(1, along - GAP * (step.split.children.length - 1));
  const { size: applied, reason } = shareLimit(free, size);
  return { layout: { ...layout, dock: withSizes(layout.dock, step.split, sharesOf(step, applied / free)) }, reason };
};

export { placeSize };
