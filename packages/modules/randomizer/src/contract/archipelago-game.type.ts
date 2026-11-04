/* @layer core @kind types */
import type { ArchipelagoSocket } from '../archipelago/protocol/socket.type';
import type { DataPackageCache } from '../archipelago/data-package/data-package-cache.type';
import type { OnlineConnection, ReceivedItem, SlotReading } from '../archipelago/client/online-host.type';
import type { RandomizerProfileConfig } from '../augment';
import type { DeliveryRequest } from '../session/delivery/delivery-request.type';
import type { PollEntry } from '../session/poller/poll-entry.type';

type ArchipelagoGame<P, A> = {
  name: string;
  worldVersion?: string;
  locationKeyOf(id: number, name: string): string | null;
  locationIdOf(key: string): number | null;
  slot(raw: unknown): SlotReading<P>;
  receivedAction(item: ReceivedItem): Omit<DeliveryRequest<A>, 'onGranted' | 'source'> | null;
  receivedOrder?(items: readonly ReceivedItem[]): readonly ReceivedItem[];
  goal?: PollEntry;
  deathLink?: {
    onDied(f: (cause: string) => void): () => void;
    kill(): 'armed' | 'down' | 'unsupported';
    setEnabled?(on: boolean): void;
  };
  file?: { inPlay(): boolean; onSwap(f: () => void): () => void };
  markCollected?(keys: readonly string[]): void;
  arm?(connection: OnlineConnection): void;
  disarm?(): void;
  createSocket?(url: string): ArchipelagoSocket;
  dataPackages?: DataPackageCache;
  allows?(): string | null;
  visible?(flags: ReadonlySet<string>): boolean;
  patched?(config: RandomizerProfileConfig): RandomizerProfileConfig;
};

export type { ArchipelagoGame };
