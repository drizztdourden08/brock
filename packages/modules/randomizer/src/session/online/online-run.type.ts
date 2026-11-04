/* @layer core @kind types */
import type { ListenerSet, ScoutedInput, ScoutedLocation } from '../../archipelago';
import type { ArmedSeed } from '../applier/armed-seed.type';
import type { DeliveryQueue } from '../delivery/delivery-request.type';

interface OnlineRun<A> {
  live: boolean;
  generation: number;
  armed: ArmedSeed<A> | null;
  queue: DeliveryQueue<A> | null;
  placement: unknown;
  scouted: ScoutedInput | null;
  keysById: Map<number, string>;
  entriesByKey: Map<string, ScoutedLocation>;
  grants: Set<number>;
  collected: Set<number>;
  reportedAll: Set<string>;
  pollWanted: boolean;
  goalDone: boolean;
  applying: boolean;
  ready: ListenerSet<[]>;
  stopCore: (() => void) | null;
}

export type { OnlineRun };
