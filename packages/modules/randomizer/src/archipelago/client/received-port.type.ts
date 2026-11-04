/* @layer core @kind types */
interface ReceivedPort {
  epoch(): number;
  queued(): number;
  next(): number;
  isNew(index: number): boolean;
  hand(index: number): void;
  settle(index: number, epoch: number): boolean;
  reset(): void;
}

export type { ReceivedPort };
