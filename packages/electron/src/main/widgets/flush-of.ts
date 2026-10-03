/* @layer electron-main @kind logic */
import type { WidgetEdge, WidgetWindowBounds } from '@drizztdourden08/brock-core';

const flushOf = (bounds: WidgetWindowBounds, edge: WidgetEdge, target: WidgetWindowBounds): number => {
  if (edge === 'right') return target.x + target.width;
  if (edge === 'left') return target.x - bounds.width;
  if (edge === 'bottom') return target.y + target.height;
  return target.y - bounds.height;
};

export { flushOf };
