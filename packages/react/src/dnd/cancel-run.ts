/* @layer renderer-shell @kind logic */
import type { DndElement } from './dnd.type';
import { runHandlers } from './drag-run-handlers';
import { runState } from './drag-run-state';
import { finishRun } from './finish-run';

const cancelRunOf = (element: DndElement): void => {
  const active = runState.current;
  if (active?.element !== element) return;
  runHandlers.cancelHover(active, active.start);
  finishRun(active, false);
};

export { cancelRunOf };
