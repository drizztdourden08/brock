/* @layer core @kind logic */
import type { DeliveryFeed } from './delivery-feed.type';
import { feedState } from './feed-state';

const deliveryFeed: DeliveryFeed = {
  read: () => feedState.held.snapshot,
  subscribe: (listener) => {
    feedState.listeners.add(listener);
    return () => {
      feedState.listeners.delete(listener);
    };
  },
};

export { deliveryFeed };
