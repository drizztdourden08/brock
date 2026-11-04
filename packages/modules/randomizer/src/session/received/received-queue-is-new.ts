/* @layer core @kind logic */
import type { ReceivedQueueState } from './received-queue.type';

const receivedQueueIsNew = (state: ReceivedQueueState, saved: number, index: number): boolean =>
  index >= saved && !state.handed.has(index) && !state.settled.has(index);

export { receivedQueueIsNew };
