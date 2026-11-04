/* @layer core @kind logic */
import { fireComplete } from './fire-complete';
import type { QueueState } from './queue-state.type';

const clearQueue = <A>(state: QueueState<A>): void => {
  const dropped = state.delivering ? [state.delivering, ...state.queue] : [...state.queue];
  state.queue = [];
  state.delivering = null;
  state.becameBusy = false;
  state.cooldownFrames = 0;
  for (const entry of dropped) fireComplete(entry);
};

export { clearQueue };
