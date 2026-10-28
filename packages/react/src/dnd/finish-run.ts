/* @layer renderer-shell @kind logic */
import { DRAGGING_ATTRIBUTE } from './dnd.constants';
import { dragSession } from './drag-session';
import { runState } from './drag-run-state';
import type { Run } from './drag-run.type';

const swallowClick = (event: Event): void => {
  event.stopPropagation();
  event.preventDefault();
};

const finishRun = (active: Run, dropped: boolean): void => {
  active.detach();
  runState.current = null;
  if (!active.started) return;
  dragSession.set(null);
  document.documentElement.removeAttribute(DRAGGING_ATTRIBUTE);
  const view = window;
  view.addEventListener('click', swallowClick, { capture: true, once: true });
  setTimeout(() => view.removeEventListener('click', swallowClick, { capture: true }), 0);
  active.options.onEnd?.({ dropped, target: dropped ? (active.hover?.entry.element ?? null) : null });
};

export { finishRun };
