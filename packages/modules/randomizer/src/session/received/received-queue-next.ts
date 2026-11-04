/* @layer core @kind logic */
import type { ReceivedQueueState } from './received-queue.type';

const receivedQueueNext = (state: ReceivedQueueState, saved: number): number => {
  let next = saved;
  while (state.handed.has(next) || state.settled.has(next)) next += 1;
  return next;
};

export { receivedQueueNext };
