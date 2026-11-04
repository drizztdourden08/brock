/* @layer core @kind types */
import type { OnlineConnection } from '../client/online-host.type';
import type { ArchipelagoSocket } from '../protocol/socket.type';
import type { NetworkFacts } from './network-facts.type';
import type { TrackerProgress } from './tracker-link.type';

interface TrackerLinksDeps {
  facts: NetworkFacts;
  createSocket(url: string): ArchipelagoSocket;
  connection(): OnlineConnection | null;
  url(): string | null;
  uuid(): string;
  onChange(): void;
}

interface TrackerLinks {
  open(): void;
  closeAll(): void;
  progressOf(slot: number): TrackerProgress | null;
  isLinked(slot: number): boolean;
  readonly size: number;
}

export type { TrackerLinks, TrackerLinksDeps };
