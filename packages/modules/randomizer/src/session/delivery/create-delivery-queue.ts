/* @layer core @kind logic */
import { clearQueue } from './clear-queue';
import type { DeliveryQueueOptions } from './delivery-queue-options.type';
import type { DeliveryQueue } from './delivery-request.type';
import { enqueueRequest } from './enqueue-request';
import { createQueueState } from './queue-state';
import { tick } from './tick';

const createDeliveryQueue = <A>(options: DeliveryQueueOptions<A>): DeliveryQueue<A> => {
  const state = createQueueState<A>();
  const ctx = { state, deliverer: options.deliverer, log: options.log };
  const stop = (): void => {
    state.stopFrames?.();
    state.stopFrames = null;
  };
  return {
    enqueue: (request) => enqueueRequest(state, request),
    clear: () => clearQueue(state),
    size: () => state.queue.length,
    start: () => {
      if (state.stopFrames) return;
      state.stopFrames = options.clock.onFrame(() => tick(ctx));
    },
    stop,
  };
};

export { createDeliveryQueue };
