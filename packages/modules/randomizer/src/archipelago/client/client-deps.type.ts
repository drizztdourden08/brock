/* @layer core @kind types */
import type { DataPackageCache } from '../data-package/data-package-cache.type';
import type { CreateSocket } from '../socket/socket-link.type';
import type { ReceivedItem, OnlineHost, SlotReading } from './online-host.type';
import type { ReceivedPort } from './received-port.type';

interface ClientDeps {
  game: string;
  host: OnlineHost;
  received: ReceivedPort;
  slot(raw: unknown): SlotReading<unknown>;
  locationKeyOf(id: number, name: string): string | null;
  placed(placement: unknown): void;
  order?(items: readonly ReceivedItem[]): readonly ReceivedItem[];
  createSocket?: CreateSocket;
  cache?: DataPackageCache;
  log?(line: string, level?: 'warn' | 'error'): void;
  now?(): number;
}

export type { ClientDeps };
