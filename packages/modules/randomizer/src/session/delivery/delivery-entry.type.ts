/* @layer core @kind types */
import type { DeliveryRequest } from './delivery-request.type';

interface DeliveryEntry<A> {
  id: string;
  request: DeliveryRequest<A>;
  waitedFrames: number;
  refusals: number;
  granted: boolean;
}

export type { DeliveryEntry };
