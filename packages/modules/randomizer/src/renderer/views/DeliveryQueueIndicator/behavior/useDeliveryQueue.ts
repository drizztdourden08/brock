/* @layer renderer-shell @kind hook */
import { useSyncExternalStore } from 'react';
import { deliveryFeed } from '../../../../session/delivery/delivery-feed';
import type { DeliverySnapshot } from '../../../../session/delivery/delivery-feed.type';

const useDeliveryQueue = (): DeliverySnapshot => useSyncExternalStore(deliveryFeed.subscribe, deliveryFeed.read);

export { useDeliveryQueue };
