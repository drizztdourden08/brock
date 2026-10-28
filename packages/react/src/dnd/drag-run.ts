/* @layer renderer-shell @kind logic */
import { DRAG_THRESHOLD_PX, DRAGGING_ATTRIBUTE } from './dnd.constants';
import type { DragPoint, DragSourceOptions } from './dnd.type';
import { dragSession } from './drag-session';
import { sendFeedback } from './drop-feedback';
import type { Hover } from './target-entry.type';
import { targetRegistry } from './target-registry';

interface Run {
  element: Element;
  options: DragSourceOptions<unknown>;
  start: DragPoint;
  pointerId: number;
  started: boolean;
  payload: unknown;
  hover: Hover | null;
  detach: () => void;
}

let run: Run | null = null;

const pointOf = (event: Event): DragPoint => {
  const { clientX, clientY } = event as PointerEvent;
  return { x: clientX, y: clientY };
};

const same = (a: Hover | null, b: Hover | null): boolean => a?.entry === b?.entry;

const hoverAt = (active: Run, point: DragPoint): void => {
  const type = active.options.type.name;
  const next = targetRegistry.find(point, type, active.payload, active.element);
  const prev = active.hover;
  if (prev && !same(prev, next)) sendFeedback(prev, 'leave', point, type, active.payload);
  if (next && !same(prev, next)) sendFeedback(next, 'enter', point, type, active.payload);
  else if (next && prev && (next.index !== prev.index || next.accepted !== prev.accepted)) sendFeedback(next, 'over', point, type, active.payload);
  active.hover = next;
};

const begin = (active: Run): void => {
  active.started = true;
  const { payload } = active.options;
  active.payload = typeof payload === 'function' ? (payload as () => unknown)() : payload;
  dragSession.set({ type: active.options.type.name, payload: active.payload });
  document.documentElement.setAttribute(DRAGGING_ATTRIBUTE, active.options.type.name);
  active.options.onStart?.(active.payload);
};

const swallowSelect = (event: Event): void => event.preventDefault();

const swallowClick = (event: Event): void => {
  event.stopPropagation();
  event.preventDefault();
};

const onMove = (event: Event): void => {
  const active = run;
  if (!active || (event as PointerEvent).pointerId !== active.pointerId) return;
  const point = pointOf(event);
  if (!active.started) {
    if (Math.hypot(point.x - active.start.x, point.y - active.start.y) < DRAG_THRESHOLD_PX) return;
    begin(active);
  }
  hoverAt(active, point);
};

const finish = (active: Run, dropped: boolean): void => {
  active.detach();
  run = null;
  if (!active.started) return;
  dragSession.set(null);
  document.documentElement.removeAttribute(DRAGGING_ATTRIBUTE);
  const view = window;
  view.addEventListener('click', swallowClick, { capture: true, once: true });
  setTimeout(() => view.removeEventListener('click', swallowClick, { capture: true }), 0);
  active.options.onEnd?.({ dropped, target: dropped ? (active.hover?.entry.element ?? null) : null });
};

const cancelHover = (active: Run, point: DragPoint): void => {
  if (active.hover) sendFeedback(active.hover, 'leave', point, active.options.type.name, active.payload);
};

const onUp = (event: Event): void => {
  const active = run;
  if (!active || (event as PointerEvent).pointerId !== active.pointerId) return;
  const point = pointOf(event);
  const { hover, payload } = active;
  const type = active.options.type.name;
  if (!active.started || !hover?.accepted) {
    if (active.started) cancelHover(active, point);
    finish(active, false);
    return;
  }
  sendFeedback(hover, 'drop', point, type, payload);
  const info = targetRegistry.infoOf(hover.entry, point, type, active.element);
  try {
    hover.entry.options.onDrop(payload, info);
  } finally {
    finish(active, true);
  }
};

const onCancel = (event: Event): void => {
  const active = run;
  if (!active || (event as PointerEvent).pointerId !== active.pointerId) return;
  cancelHover(active, pointOf(event));
  finish(active, false);
};

const onKey = (event: Event): void => {
  const active = run;
  if (!active || (event as KeyboardEvent).key !== 'Escape') return;
  if (active.started) event.stopPropagation();
  cancelHover(active, active.start);
  finish(active, false);
};

const startRun = (element: Element, options: DragSourceOptions<unknown>, event: Event): void => {
  if (run) return;
  const detach = (): void => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onCancel);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('selectstart', swallowSelect);
  };
  run = { element, options, start: pointOf(event), pointerId: (event as PointerEvent).pointerId, started: false, payload: null, hover: null, detach };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onCancel);
  window.addEventListener('keydown', onKey);
  window.addEventListener('selectstart', swallowSelect);
};

const cancelRunOf = (element: Element): void => {
  if (run?.element !== element) return;
  cancelHover(run, run.start);
  finish(run, false);
};

export { cancelRunOf, startRun };
