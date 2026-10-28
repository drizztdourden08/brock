/* @layer renderer-shell @kind logic */
import type { DndElement, DragSourceOptions } from './dnd.type';
import { runHandlers } from './drag-run-handlers';
import { runState } from './drag-run-state';

const detachAll = (): void => {
  window.removeEventListener('pointermove', runHandlers.move);
  window.removeEventListener('pointerup', runHandlers.up);
  window.removeEventListener('pointercancel', runHandlers.cancel);
  window.removeEventListener('keydown', runHandlers.key);
  window.removeEventListener('selectstart', runHandlers.select);
};

const startRun = (element: DndElement, options: DragSourceOptions<unknown>, event: Event): void => {
  if (runState.current) return;
  const { clientX, clientY, pointerId } = event as PointerEvent;
  runState.current = { element, options, start: { x: clientX, y: clientY }, pointerId, started: false, payload: null, hover: null, detach: detachAll };
  window.addEventListener('pointermove', runHandlers.move);
  window.addEventListener('pointerup', runHandlers.up);
  window.addEventListener('pointercancel', runHandlers.cancel);
  window.addEventListener('keydown', runHandlers.key);
  window.addEventListener('selectstart', runHandlers.select);
};

export { startRun };
