/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { boundsOf } from './bounds-of';
import { edgeWindows } from './edge-windows';
import { manipulationRules } from './manipulation-rules';
import { memberOf } from './member-of';
import { minSizeOf } from './min-size-of';
import { modifierState } from './modifier-state';
import { placeMember } from './place-member';
import { resizeEdges } from './resize-edges';
import { resizeSnap } from './resize-snap';
import { sameBounds } from './same-bounds';
import { sharedEdgeResize } from './shared-edge-resize';
import { towHold } from './tow-hold';
import type { EdgeMove } from './widget-windows.type';

const applyMoves = (moves: readonly EdgeMove[]): void => {
  if (moves.length > 0) towHold.hold();
  for (const move of moves) {
    const member = memberOf(move.id);
    if (member && !sameBounds(boundsOf(member.win), move.bounds)) placeMember(member, move.bounds, true);
  }
};

const resizeBounds = (id: string, proposed: WidgetWindowBounds, edge?: string): WidgetWindowBounds | null => {
  const member = memberOf(id);
  if (!member) return null;
  const rules = manipulationRules(modifierState.ctrl, member.entry?.snap ?? true);
  if (!rules.snap && !rules.shared) return null;
  const current = boundsOf(member.win);
  const others = edgeWindows(id);
  const edges = resizeEdges(current, proposed, edge);
  const snapped = rules.snap ? resizeSnap(proposed, edges, others.map((other) => other.bounds), minSizeOf(member.win)) : proposed;
  const shared = rules.shared ? sharedEdgeResize(current, snapped, others) : { bounds: snapped, moves: [] };
  applyMoves(shared.moves);
  return sameBounds(shared.bounds, proposed) ? null : shared.bounds;
};

export { resizeBounds };
