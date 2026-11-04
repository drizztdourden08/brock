/* @layer core @kind logic */
import type { ReceivedQueueState } from './received-queue.type';

const markHanded = (state: ReceivedQueueState, index: number): void => {
  if (state.handed.has(index)) return;
  state.handed.add(index);
  state.queued += 1;
};

export { markHanded };
