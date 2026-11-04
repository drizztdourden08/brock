/* @layer core @kind types */
import type { RoomMessage } from '../messages/message-log.type';
import type { NetworkStatus } from '../network/network-status.type';
import type { OnlineConnection } from './online-host.type';

interface ArchipelagoClient {
  connect(c: OnlineConnection): void;
  close(): void;
  say(text: string): void;
  setDeathLink(on: boolean): void;
  status(): NetworkStatus;
  messages(): readonly RoomMessage[];
  subscribe(f: () => void): () => void;
}

export type { ArchipelagoClient };
