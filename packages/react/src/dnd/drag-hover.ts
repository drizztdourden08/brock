/* @layer renderer-shell @kind logic */
import type { DragPoint } from './dnd.type';
import { probeOf } from './drag-probe';
import type { Run } from './drag-run.type';
import { sendFeedback } from './drop-feedback';
import type { Hover } from './target-entry.type';
import { targetRegistry } from './target-registry';

const same = (a: Hover | null, b: Hover | null): boolean => a?.entry === b?.entry;

const moved = (next: Hover, prev: Hover | null): boolean => prev !== null && (next.index !== prev.index || next.accepted !== prev.accepted);

const hoverAt = (active: Run, point: DragPoint): void => {
  const probe = probeOf(active, point);
  const next = targetRegistry.find(probe);
  const prev = active.hover;
  if (prev && !same(prev, next)) sendFeedback(prev, 'leave', probe);
  if (next && !same(prev, next)) sendFeedback(next, 'enter', probe);
  else if (next && moved(next, prev)) sendFeedback(next, 'over', probe);
  active.hover = next;
};

export { hoverAt };
