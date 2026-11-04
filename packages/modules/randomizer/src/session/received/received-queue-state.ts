/* @layer core @kind logic */
import type { ReceivedQueueState } from './received-queue.type';

const createReceivedQueueState = (): ReceivedQueueState => ({
  queued: 0,
  handed: new Set(),
  settled: new Set(),
  epoch: 0,
});

export { createReceivedQueueState };
