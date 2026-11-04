/* @layer core @kind types */
import type { ReceivedPort } from '../../archipelago/client/received-port.type';
import type { ApStateStore } from './ap-state-store.type';

interface ReceivedQueueState {
  queued: number;
  handed: Set<number>;
  settled: Set<number>;
  epoch: number;
}

interface ReceivedQueueOptions {
  store?: ApStateStore;
  roomHash(): string;
}

interface ReceivedQueue extends ReceivedPort {
  readonly state: ReceivedQueueState;
  saved(): number;
}

export type { ReceivedQueue, ReceivedQueueOptions, ReceivedQueueState };
