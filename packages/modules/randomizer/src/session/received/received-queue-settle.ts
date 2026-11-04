/* @layer core @kind logic */
import { settlePosition } from './settle-position';
import type { ReceivedQueueState } from './received-queue.type';

const markSettled = (state: ReceivedQueueState, index: number, saved: number): number => {
  if (state.handed.delete(index)) state.queued -= 1;
  return settlePosition(state.settled, index, saved);
};

export { markSettled };
