/* @layer core @kind logic */
import { isDeliveryReady } from './is-delivery-ready';
import type { OnlineParts } from './online-parts.type';

const signalDeliveryReady = <P, A>(parts: OnlineParts<P, A>): void => {
  if (isDeliveryReady(parts)) parts.run.ready.emit();
};

export { signalDeliveryReady };
