/* @layer core @kind logic */
import type { DeliveryEntry } from './delivery-entry.type';

const fireComplete = <A>(entry: DeliveryEntry<A>): void => {
  try { entry.request.onComplete?.(); } catch { return undefined; }
};

export { fireComplete };
