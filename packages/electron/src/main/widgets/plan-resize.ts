/* @layer electron-main @kind logic */
import type { WidgetEdge, WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { ratioBounds } from '../window/ratio-bounds';
import { isAcross } from './is-across';
import { oppositeEdge } from './opposite-edge';
import { resizeSides } from './resize-sides';
import { resizeSnap } from './resize-snap';
import { resizeTargets } from './resize-targets';
import { EMPTY_BOUNDS, NO_SIDES, RESIZE_SIDES } from './widget-windows.constants';
import type { EdgeMove, MinSize, ResizeEdges, ResizeFollower, ResizeRequest, ResizeSession, ResizeStep } from './widget-windows.type';

const { lineOf, withLine } = resizeSides;

const keepMin = (b: WidgetWindowBounds, sides: ResizeEdges, min: MinSize): WidgetWindowBounds => {
  let left = b.x;
  let right = b.x + b.width;
  let top = b.y;
  let bottom = b.y + b.height;
  if (sides.left) left = Math.min(left, right - min.width);
  if (sides.right) right = Math.max(right, left + min.width);
  if (sides.top) top = Math.min(top, bottom - min.height);
  if (sides.bottom) bottom = Math.max(bottom, top + min.height);
  return { x: left, y: top, width: right - left, height: bottom - top };
};

const draggedTo = (session: ResizeSession, proposed: WidgetWindowBounds): WidgetWindowBounds => {
  const { start, first, sides } = session;
  const moved = RESIZE_SIDES.filter((side) => sides[side])
    .reduce((b, side) => withLine(b, side, lineOf(start, side) + lineOf(proposed, side) - lineOf(first, side)), start);
  return keepMin(moved, sides, session.min);
};

const snapSides = (b: WidgetWindowBounds, session: ResizeSession): WidgetWindowBounds => {
  const { sides, min } = session;
  const across = resizeSnap(b, { ...NO_SIDES, left: sides.left, right: sides.right }, resizeTargets(session, true), min);
  return resizeSnap(across, { ...NO_SIDES, top: sides.top, bottom: sides.bottom }, resizeTargets(session, false), min);
};

const roomFor = (line: number, side: WidgetEdge, followers: readonly ResizeFollower[]): number =>
  followers.reduce((at, f) => {
    const keep = isAcross(side) ? f.min.width : f.min.height;
    const fixed = lineOf(f.start, oppositeEdge(f.edge));
    return f.edge === 'right' || f.edge === 'bottom' ? Math.max(at, fixed + keep) : Math.min(at, fixed - keep);
  }, line);

const followerMoves = (followers: readonly ResizeFollower[], place: (f: ResizeFollower, at: WidgetWindowBounds) => WidgetWindowBounds): EdgeMove[] =>
  [...new Set(followers.map((f) => f.id))].map((id) => {
    const own = followers.filter((f) => f.id === id);
    return { id, bounds: own.reduce((at, f) => place(f, at), own[0]?.start ?? EMPTY_BOUNDS) };
  });

const withFollowers = (b: WidgetWindowBounds, session: ResizeSession, shared: boolean): ResizeStep => {
  if (!shared) return { bounds: b, moves: followerMoves(session.followers, (_f, at) => at) };
  const bounds = RESIZE_SIDES.reduce((at, side) => {
    const group = session.followers.filter((f) => f.side === side);
    const line = lineOf(at, side);
    return group.length === 0 || line === lineOf(session.start, side) ? at : withLine(at, side, roomFor(line, side, group));
  }, b);
  const moves = followerMoves(session.followers, (f, at) => withLine(at, f.edge, lineOf(bounds, f.side)));
  return { bounds, moves };
};

const planResize = (session: ResizeSession, { proposed, rules, lock }: ResizeRequest): ResizeStep => {
  const dragged = draggedTo(session, proposed);
  const fitted = session.locked ? ratioBounds(session.start, dragged, session.edge, lock) ?? session.last : dragged;
  const snapped = rules.snap && !session.locked ? snapSides(fitted, session) : fitted;
  return withFollowers(snapped, session, rules.shared);
};

export { planResize };
