/* @layer electron-main @kind logic */
import type { WidgetEdge, WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { isAcross } from './is-across';
import { oppositeEdge } from './opposite-edge';
import { resizeSides } from './resize-sides';
import { spansOverlap } from './spans-overlap';
import { FLUSH_TOLERANCE } from './widget-windows.constants';
import type { LineWindow, ResizeFollower, ResizeNeighbour, Span } from './widget-windows.type';

const near = (a: number, b: number): boolean => Math.abs(a - b) <= FLUSH_TOLERANCE;

const spanAlong = (b: WidgetWindowBounds, side: WidgetEdge): Span => (isAcross(side) ? { start: b.y, length: b.height } : { start: b.x, length: b.width });

const onLine = (start: WidgetWindowBounds, side: WidgetEdge, other: ResizeNeighbour): LineWindow | null => {
  const at = resizeSides.lineOf(start, side);
  const span = spanAlong(other.bounds, side);
  if (near(resizeSides.lineOf(other.bounds, oppositeEdge(side)), at)) return { other, edge: oppositeEdge(side), far: true, span };
  return near(resizeSides.lineOf(other.bounds, side), at) ? { other, edge: side, far: false, span } : null;
};

const endToEnd = (a: Span, b: Span): boolean => near(a.start + a.length, b.start) || near(b.start + b.length, a.start);

const joined = (a: Pick<LineWindow, 'far' | 'span'>, b: LineWindow): boolean => {
  if (a.far !== b.far) return spansOverlap(a.span.start, a.span.length, b.span.start, b.span.length);
  return a.far && b.far && endToEnd(a.span, b.span);
};

const lineFollowers = (start: WidgetWindowBounds, side: WidgetEdge, others: readonly ResizeNeighbour[]): ResizeFollower[] => {
  const open = others.filter((other) => other.canFollow).map((other) => onLine(start, side, other)).filter((found): found is LineWindow => found !== null);
  const reached: LineWindow[] = [];
  const queue: Pick<LineWindow, 'far' | 'span'>[] = [{ far: false, span: spanAlong(start, side) }];
  for (let from = queue.shift(); from !== undefined; from = queue.shift()) {
    const next = open.filter((candidate) => !reached.includes(candidate) && joined(from, candidate));
    reached.push(...next);
    queue.push(...next);
  }
  return reached.map(({ other, edge }) => ({ id: other.id, side, edge, start: other.bounds, min: other.min }));
};

export { lineFollowers };
