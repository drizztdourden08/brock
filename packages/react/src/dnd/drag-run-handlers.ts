/* @layer renderer-shell @kind logic */
import { DRAG_THRESHOLD_PX, DRAGGING_ATTRIBUTE } from './dnd.constants';
import type { DragPoint } from './dnd.type';
import { dragSession } from './drag-session';
import { hoverAt } from './drag-hover';
import { probeOf } from './drag-probe';
import { runState } from './drag-run-state';
import type { Run } from './drag-run.type';
import { sendFeedback } from './drop-feedback';
import { finishRun } from './finish-run';
import { targetRegistry } from './target-registry';

const pointOf = (event: Event): DragPoint => {
  const { clientX, clientY } = event as PointerEvent;
  return { x: clientX, y: clientY };
};

const ownerOf = (event: Event): Run | null => {
  const active = runState.current;
  return active?.pointerId === (event as PointerEvent).pointerId ? active : null;
};

const begin = (active: Run): void => {
  active.started = true;
  const { payload } = active.options;
  active.payload = typeof payload === 'function' ? (payload as () => unknown)() : payload;
  dragSession.set({ type: active.options.type.name, payload: active.payload });
  document.documentElement.setAttribute(DRAGGING_ATTRIBUTE, active.options.type.name);
  active.options.onStart?.(active.payload);
};

const cancelHover = (active: Run, point: DragPoint): void => {
  if (active.hover) sendFeedback(active.hover, 'leave', probeOf(active, point));
};

const move = (event: Event): void => {
  const active = ownerOf(event);
  if (!active) return;
  const point = pointOf(event);
  if (!active.started) {
    if (Math.hypot(point.x - active.start.x, point.y - active.start.y) < DRAG_THRESHOLD_PX) return;
    begin(active);
  }
  hoverAt(active, point);
};

const up = (event: Event): void => {
  const active = ownerOf(event);
  if (!active) return;
  const point = pointOf(event);
  const { hover } = active;
  if (!active.started || !hover?.accepted) {
    if (active.started) cancelHover(active, point);
    finishRun(active, false);
    return;
  }
  const probe = probeOf(active, point);
  sendFeedback(hover, 'drop', probe);
  try {
    hover.entry.options.onDrop(active.payload, targetRegistry.infoOf(hover.entry, probe));
  } finally {
    finishRun(active, true);
  }
};

const cancel = (event: Event): void => {
  const active = ownerOf(event);
  if (!active) return;
  cancelHover(active, pointOf(event));
  finishRun(active, false);
};

const key = (event: Event): void => {
  const active = runState.current;
  if (!active || (event as KeyboardEvent).key !== 'Escape') return;
  if (active.started) event.stopPropagation();
  cancelHover(active, active.start);
  finishRun(active, false);
};

const select = (event: Event): void => event.preventDefault();

const runHandlers = { move, up, cancel, key, select, cancelHover };

export { runHandlers };
