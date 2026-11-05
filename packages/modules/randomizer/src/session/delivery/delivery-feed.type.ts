/* @layer core @kind types */
interface DeliveryLine {
  id: string;
  message: string;
  source: string;
}

interface DeliverySnapshot {
  pending: readonly DeliveryLine[];
  delivering: DeliveryLine | null;
}

interface DeliveryFeed {
  read(): DeliverySnapshot;
  subscribe(listener: () => void): () => void;
}

export type { DeliveryFeed, DeliveryLine, DeliverySnapshot };
