/* @layer core @kind logic */
import { settlePosition } from './settle-position';
import type { ReceivedQueueState } from './received-queue.type';

const markHanded = (state: ReceivedQueueState, index: number): void => {
  if (state.handed.has(index)) return;
  state.handed.add(index);
  state.queued += 1;
};

const markSettled = (state: ReceivedQueueState, index: number, saved: number): number => {
  if (state.handed.delete(index)) state.queued -= 1;
  return settlePosition(state.settled, index, saved);
};

export { markHanded, markSettled };
