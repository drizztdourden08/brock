/* @layer core @kind types */
type DeliveryRequest<A> = {
  message: string;
  source: string;
  action: A;
  onComplete?(): void;
  onGranted?(): void;
};

type DeliveryQueue<A> = {
  enqueue(req: DeliveryRequest<A>): string;
  clear(): void;
  size(): number;
  start(): void;
  stop(): void;
};

export type { DeliveryRequest, DeliveryQueue };
