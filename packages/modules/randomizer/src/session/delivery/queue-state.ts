/* @layer core @kind logic */
import type { QueueState } from './queue-state.type';

const createQueueState = <A>(): QueueState<A> => ({
  queue: [],
  delivering: null,
  cooldownFrames: 0,
  becameBusy: false,
  nextId: 0,
  stopFrames: null,
});

export { createQueueState };
