/* @layer core @kind logic */
import { EMPTY_SNAPSHOT } from './delivery-feed.constants';
import type { DeliveryFeed } from './delivery-feed.type';
import type { QueueState } from './queue-state.type';
import { snapshotKey } from './snapshot-key';
import { snapshotOf } from './snapshot-of';

const listeners = new Set<() => void>();

const held = { key: '', snapshot: EMPTY_SNAPSHOT };

const deliveryFeed: DeliveryFeed = {
  read: () => held.snapshot,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

const announceQueue = <A>(state: QueueState<A>): void => {
  const key = snapshotKey(state);
  if (key === held.key) return;
  held.key = key;
  held.snapshot = snapshotOf(state);
  for (const listener of [...listeners]) listener();
};

export { announceQueue, deliveryFeed };
