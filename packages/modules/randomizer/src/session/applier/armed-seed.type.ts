/* @layer core @kind types */
import type { DeliveryRequest } from '../delivery/delivery-request.type';
import type { PollEntry } from '../poller/poll-entry.type';

type ArmedSeed<A> = {
  polled?: readonly PollEntry[];
  counts: Record<string, number>;
  serverGrants?: readonly string[];
  onCheck(key: string, deliver: (req: DeliveryRequest<A>) => string | null): void;
  stop?(): void;
};

export type { ArmedSeed };
