/* @layer core @kind logic */
import type { DeliveryEntry } from './delivery-entry.type';

const fireGranted = <A>(entry: DeliveryEntry<A>): void => {
  entry.granted = true;
  try { entry.request.onGranted?.(); } catch { return undefined; }
};

export { fireGranted };
