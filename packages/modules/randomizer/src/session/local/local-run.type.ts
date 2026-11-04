/* @layer core @kind types */
import type { ArmedSeed } from '../applier/armed-seed.type';
import type { DeliveryQueue } from '../delivery/delivery-request.type';
import type { LocationPoller } from '../poller/location-poller.type';

interface LocalRun<A> {
  armed: ArmedSeed<A>;
  poller: LocationPoller;
  queue: DeliveryQueue<A> | null;
  stopAdopt: () => void;
}

export type { LocalRun };
