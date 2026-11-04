/* @layer core @kind types */
import type { OnlineConnection } from '../client/online-host.type';
import type { ApClientPacket } from '../protocol/client-packets.type';
import type { ApServerPacket } from '../protocol/server-packets.type';
import type { ArchipelagoSocket } from '../protocol/socket.type';
import type { NetworkFacts } from './network-facts.type';
import type { NetworkStatus } from './network-status.type';

interface NetworkMonitorDeps {
  send(packet: ApClientPacket): void;
  createSocket(url: string): ArchipelagoSocket;
  uuid(): string;
  now?(): number;
}

interface NetworkMonitor {
  status(): NetworkStatus;
  subscribe(f: () => void): () => void;
  received(packet: ApServerPacket): boolean;
  changed(): void;
  connecting(): void;
  opened(url: string, connection: OnlineConnection): void;
  retrying(): void;
  refused(): void;
  closed(): void;
  stop(): void;
  reset(): void;
}

type NetworkLifecycle = Pick<
  NetworkMonitor, 'connecting' | 'opened' | 'retrying' | 'refused' | 'closed' | 'stop' | 'reset'
>;

interface LifecycleControl {
  facts: NetworkFacts;
  changed(): void;
  forgetConnection(): void;
  remember(url: string | null, connection: OnlineConnection | null): void;
}

export type { LifecycleControl, NetworkLifecycle, NetworkMonitor, NetworkMonitorDeps };
