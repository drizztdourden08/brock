/* @layer core @kind logic */
import { isDeliveryReady } from './is-delivery-ready';
import { ONLINE_SOURCE } from './online-session.constants';
import type { DeliveryHost } from './host-delivery.type';
import type { OnlineParts } from './online-parts.type';

const hostDelivery = <P, A>(parts: OnlineParts<P, A>): DeliveryHost => {
  const { run, ap, received } = parts;
  return {
    deliver(item) {
      const queue = run.queue;
      if (queue === null || !isDeliveryReady(parts)) return 'not-ready';
      const request = ap.receivedAction(item);
      if (request === null) return 'unknown';
      const epoch = received.epoch();
      queue.enqueue({
        ...request,
        source: ONLINE_SOURCE,
        onGranted: () => {
          received.settle(item.index, epoch);
        },
      });
      return 'delivered';
    },
    cancelDeliveries() {
      run.queue?.clear();
    },
    onDeliveryReady: (f) => run.ready.add(f),
  };
};

export { hostDelivery };
