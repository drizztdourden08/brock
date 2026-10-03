/* @layer electron-main @kind logic */
import type { WidgetEdge, WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { flushOf } from './flush-of';
import { isAcross } from './is-across';
import { spansOverlap } from './spans-overlap';
import { FLUSH_TOLERANCE } from './widget-windows.constants';

const isFlush = (bounds: WidgetWindowBounds, edge: WidgetEdge, target: WidgetWindowBounds): boolean => {
  const flush = flushOf(bounds, edge, target);
  if (isAcross(edge)) return Math.abs(flush - bounds.x) <= FLUSH_TOLERANCE && spansOverlap(bounds.y, bounds.height, target.y, target.height);
  return Math.abs(flush - bounds.y) <= FLUSH_TOLERANCE && spansOverlap(bounds.x, bounds.width, target.x, target.width);
};

export { isFlush };
