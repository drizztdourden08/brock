/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { clampToArea } from './clamp-to-area';
import { isReachable } from './is-reachable';

const gap = (point: number, start: number, length: number): number => Math.max(start - point, 0, point - (start + length));

const distanceTo = (bounds: WidgetWindowBounds, area: WidgetWindowBounds): number =>
  Math.hypot(gap(bounds.x + bounds.width / 2, area.x, area.width), gap(bounds.y + bounds.height / 2, area.y, area.height));

const rescueBounds = (bounds: WidgetWindowBounds, areas: readonly WidgetWindowBounds[]): WidgetWindowBounds | null => {
  const [first, ...rest] = areas;
  if (!first || isReachable(bounds, areas)) return null;
  const nearest = rest.reduce((best, area) => (distanceTo(bounds, area) < distanceTo(bounds, best) ? area : best), first);
  return clampToArea(bounds, nearest);
};

export { rescueBounds };
