/* @layer core @kind logic */
import type { DeliveryRequest } from './delivery-request.type';
import type { QueueState } from './queue-state.type';

const enqueueRequest = <A>(state: QueueState<A>, request: DeliveryRequest<A>): string => {
  const id = `dlv_${Date.now()}_${state.nextId++}`;
  state.queue.push({ id, request, waitedFrames: 0, refusals: 0, granted: false });
  return id;
};

export { enqueueRequest };
