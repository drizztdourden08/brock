/* @layer core @kind types */
import type { DeliveryEntry } from './delivery-entry.type';

interface QueueState<A> {
  queue: DeliveryEntry<A>[];
  delivering: DeliveryEntry<A> | null;
  cooldownFrames: number;
  becameBusy: boolean;
  nextId: number;
  stopFrames: (() => void) | null;
}

export type { QueueState };
