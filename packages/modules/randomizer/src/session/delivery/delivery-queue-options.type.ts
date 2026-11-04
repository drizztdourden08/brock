/* @layer core @kind types */
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import type { FrameClock } from './frame-clock.type';
import type { ItemDeliverer } from './item-deliverer.type';

interface DeliveryQueueOptions<A> {
  deliverer: ItemDeliverer<A>;
  clock: FrameClock;
  log: RandomizerLog;
}

export type { DeliveryQueueOptions };
