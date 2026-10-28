/* @layer renderer-shell @kind logic */
import { holdsMain, layoutTree, widgetsIn } from '@drizztdourden08/tessera/composites';
import type { LayoutNode, WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { EdgeStep, ResizeStep } from './widget-resize-edit.type';
import { sideAxis } from './widget-side-axis';
import { widgetSideOf } from './widget-side-of';
import { stageRect } from './widget-stage-rect';

const ancestry = (node: LayoutNode, id: string): ResizeStep[] => {
  if (node.kind !== 'split') return [];
  const at = node.children.findIndex((child) => widgetsIn(child).includes(id));
  const next = node.children[at];
  return at < 0 || !next ? [] : [{ split: node, at }, ...ancestry(next, id)];
};

const edgeStepOf = (layout: WidgetLayout, id: string): EdgeStep | undefined => {
  const axis = sideAxis(widgetSideOf(layout.dock, id));
  const step = ancestry(layout.dock, id).reverse().find((each) => each.split.axis === axis && !holdsMain(each.split.children[each.at] ?? layout.dock));
  const along = step ? layoutTree(layout.dock, stageRect()).dividers.find((divider) => divider.node === step.split)?.along : undefined;
  return step && along !== undefined ? { step, along } : undefined;
};

export { edgeStepOf };
