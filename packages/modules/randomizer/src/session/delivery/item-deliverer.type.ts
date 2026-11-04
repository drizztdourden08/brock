/* @layer core @kind types */
type DeliveryOutcome = 'done' | 'settled' | 'refused';

interface ItemDeliverer<A> {
  isSafeFrame(): boolean;
  execute(action: A): DeliveryOutcome;
  holdsInFlight?(action: A): boolean;
}

export type { DeliveryOutcome, ItemDeliverer };
