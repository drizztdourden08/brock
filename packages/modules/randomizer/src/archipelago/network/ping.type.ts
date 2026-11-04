/* @layer core @kind types */
import type { ApClientPacket } from '../protocol/client-packets.type';
import type { ApBouncedPacket } from '../protocol/server-packets.type';

interface PingDeps {
  send(packet: ApClientPacket): void;
  onSample(): void;
  now?(): number;
}

interface Pinger {
  readonly lastMs: number | null;
  readonly meanMs: number | null;
  readonly samples: number;
  start(slot: number): void;
  stop(): void;
  handleBounced(packet: ApBouncedPacket): boolean;
}

export type { PingDeps, Pinger };
