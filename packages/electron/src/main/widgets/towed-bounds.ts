/* @layer electron-main @kind logic */
import type { WidgetEdge, WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { flushOf } from './flush-of';
import { isAcross } from './is-across';
import { TOW_MIN_OVERLAP } from './widget-windows.constants';
import type { Span } from './widget-windows.type';

const keepTouching = (start: number, length: number, target: Span): number => {
  const overlap = Math.min(TOW_MIN_OVERLAP, length, target.length);
  return Math.min(Math.max(start, target.start - length + overlap), target.start + target.length - overlap);
};

const along = (own: Span, before: Span, after: Span): number => {
  const lead = after.start - before.start;
  const trail = after.start + after.length - (before.start + before.length);
  return keepTouching(lead === trail ? own.start + lead : own.start, own.length, after);
};

const towedBounds = (bounds: WidgetWindowBounds, edge: WidgetEdge, before: WidgetWindowBounds, after: WidgetWindowBounds): WidgetWindowBounds => {
  const flush = flushOf(bounds, edge, after);
  if (isAcross(edge)) {
    const y = along({ start: bounds.y, length: bounds.height }, { start: before.y, length: before.height }, { start: after.y, length: after.height });
    return { ...bounds, x: flush, y };
  }
  const x = along({ start: bounds.x, length: bounds.width }, { start: before.x, length: before.width }, { start: after.x, length: after.width });
  return { ...bounds, x, y: flush };
};

export { towedBounds };
