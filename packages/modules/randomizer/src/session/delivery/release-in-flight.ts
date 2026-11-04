/* @layer core @kind logic */
import type { DeliveryEntry } from './delivery-entry.type';
import { DELIVERY_COOLDOWN_FRAMES } from './delivery.constants';
import type { QueueState } from './queue-state.type';

const releaseInFlight = <A>(state: QueueState<A>, done: DeliveryEntry<A>): DeliveryEntry<A> => {
  state.delivering = null;
  state.cooldownFrames = DELIVERY_COOLDOWN_FRAMES;
  return done;
};

export { releaseInFlight };
