/* @layer electron-main @kind logic */
import type { WidgetEdge, WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { isAcross } from './is-across';
import { oppositeEdge } from './opposite-edge';
import { resizeSides } from './resize-sides';
import { spansOverlap } from './spans-overlap';
import { FLUSH_TOLERANCE, RESIZE_SIDES } from './widget-windows.constants';
import type { ResizeFollower, ResizeNeighbour, ResizeSession, ResizeStart } from './widget-windows.type';

const flushOn = (start: WidgetWindowBounds, side: WidgetEdge, other: WidgetWindowBounds): boolean => {
  const gap = Math.abs(resizeSides.lineOf(other, oppositeEdge(side)) - resizeSides.lineOf(start, side));
  const overlap = isAcross(side) ? spansOverlap(start.y, start.height, other.y, other.height) : spansOverlap(start.x, start.width, other.x, other.width);
  return gap <= FLUSH_TOLERANCE && overlap;
};

const followersOf = (start: WidgetWindowBounds, others: readonly ResizeNeighbour[]): ResizeFollower[] =>
  RESIZE_SIDES.flatMap((side) => others
    .filter((other) => other.canFollow && flushOn(start, side, other.bounds))
    .map((other) => ({ id: other.id, side, start: other.bounds, min: other.min })));

const linesAlong = (others: readonly ResizeNeighbour[], followers: readonly ResizeFollower[], across: boolean): WidgetWindowBounds[] =>
  others.filter((other) => !followers.some((f) => f.id === other.id && isAcross(f.side) === across)).map((other) => other.bounds);

const captureResize = ({ others, ...start }: ResizeStart): ResizeSession => {
  const followers = followersOf(start.start, others);
  return { ...start, last: start.start, followers, xTargets: linesAlong(others, followers, true), yTargets: linesAlong(others, followers, false) };
};

export { captureResize };
