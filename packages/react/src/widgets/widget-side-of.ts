/* @layer renderer-shell @kind logic */
import { holdsMain, widgetsIn } from '@drizztdourden08/tessera/composites';
import type { LayoutNode, SnapSide, SplitAxis } from '@drizztdourden08/tessera/composites';

const edgeOf = (axis: SplitAxis, before: boolean): SnapSide => {
  if (axis === 'row') return before ? 'left' : 'right';
  return before ? 'top' : 'bottom';
};

const widgetSideOf = (node: LayoutNode, id: string): SnapSide | null => {
  if (node.kind !== 'split') return null;
  const mainAt = node.children.findIndex(holdsMain);
  const at = node.children.findIndex((child) => widgetsIn(child).includes(id));
  const inner = node.children[mainAt];
  if (mainAt < 0 || at < 0) return null;
  return at === mainAt && inner ? widgetSideOf(inner, id) : edgeOf(node.axis, at < mainAt);
};

export { widgetSideOf };
