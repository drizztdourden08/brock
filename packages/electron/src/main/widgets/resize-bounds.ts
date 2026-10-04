/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { aspectLock } from '../window/aspect-lock';
import { boundsOf } from './bounds-of';
import { edgeWindows } from './edge-windows';
import { manipulationRules } from './manipulation-rules';
import { memberOf } from './member-of';
import { minSizeOf } from './min-size-of';
import { modifierState } from './modifier-state';
import { placeMember } from './place-member';
import { planResize } from './plan-resize';
import { sameBounds } from './same-bounds';
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
  const plan = planResize({ id, current, proposed, edge, others: edgeWindows(id), rules, min: minSizeOf(member.win), lock: aspectLock.get() });
  applyMoves(plan.moves);
  return sameBounds(plan.bounds, proposed) ? null : plan.bounds;
};

export { resizeBounds };
