/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { isAcross } from './is-across';
import { lineFollowers } from './line-followers';
import { RESIZE_SIDES } from './widget-windows.constants';
import type { ResizeFollower, ResizeNeighbour, ResizeSession, ResizeStart } from './widget-windows.type';

const followersOf = (start: WidgetWindowBounds, others: readonly ResizeNeighbour[]): ResizeFollower[] =>
  RESIZE_SIDES.flatMap((side) => lineFollowers(start, side, others));

const linesAlong = (others: readonly ResizeNeighbour[], followers: readonly ResizeFollower[], across: boolean): WidgetWindowBounds[] =>
  others.filter((other) => !followers.some((f) => f.id === other.id && isAcross(f.side) === across)).map((other) => other.bounds);

const captureResize = ({ others, ...start }: ResizeStart): ResizeSession => {
  const followers = followersOf(start.start, others);
  return { ...start, last: start.start, followers, xTargets: linesAlong(others, followers, true), yTargets: linesAlong(others, followers, false) };
};

export { captureResize };
