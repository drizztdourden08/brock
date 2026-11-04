/* @layer core @kind logic */
import type { ReceivedQueueState } from './received-queue.type';

const resetReceivedQueue = (state: ReceivedQueueState): void => {
  state.epoch += 1;
  state.queued = 0;
  state.handed.clear();
  state.settled.clear();
};

export { resetReceivedQueue };
