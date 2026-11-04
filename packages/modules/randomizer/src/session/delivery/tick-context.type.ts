/* @layer core @kind types */
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import type { ItemDeliverer } from './item-deliverer.type';
import type { QueueState } from './queue-state.type';

interface TickContext<A> {
  state: QueueState<A>;
  deliverer: ItemDeliverer<A>;
  log: RandomizerLog;
}

export type { TickContext };
