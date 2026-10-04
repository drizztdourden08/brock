/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { nearestLine } from './nearest-line';
import { spansNear } from './spans-near';
import { SNAP_DISTANCE } from './widget-windows.constants';
import type { MinSize, ResizeEdges } from './widget-windows.type';

const verticalLines = (proposed: WidgetWindowBounds, targets: readonly WidgetWindowBounds[], reach: number): number[] =>
  targets.filter((t) => spansNear({ start: proposed.y, length: proposed.height }, { start: t.y, length: t.height }, reach)).flatMap((t) => [t.x, t.x + t.width]);

const horizontalLines = (proposed: WidgetWindowBounds, targets: readonly WidgetWindowBounds[], reach: number): number[] =>
  targets.filter((t) => spansNear({ start: proposed.x, length: proposed.width }, { start: t.x, length: t.width }, reach)).flatMap((t) => [t.y, t.y + t.height]);

const resizeSnap = (proposed: WidgetWindowBounds, edges: ResizeEdges, targets: readonly WidgetWindowBounds[], min: MinSize): WidgetWindowBounds => {
  const reach = SNAP_DISTANCE;
  const xs = verticalLines(proposed, targets, reach);
  const ys = horizontalLines(proposed, targets, reach);
  let left = proposed.x;
  let right = proposed.x + proposed.width;
  let top = proposed.y;
  let bottom = proposed.y + proposed.height;
  if (edges.left) left = Math.min(nearestLine(left, xs, reach), right - min.width);
  if (edges.right) right = Math.max(nearestLine(right, xs, reach), left + min.width);
  if (edges.top) top = Math.min(nearestLine(top, ys, reach), bottom - min.height);
  if (edges.bottom) bottom = Math.max(nearestLine(bottom, ys, reach), top + min.height);
  return { x: left, y: top, width: right - left, height: bottom - top };
};

export { resizeSnap };
