/* @layer core @kind types */
import type { ApNetworkPlayer } from '../protocol/protocol.type';
import type { ConnectionState } from './network-status.type';

interface NetworkFacts {
  connection: ConnectionState;
  url: string | null;
  serverVersion: string | null;
  seedName: string | null;
  tags: readonly string[];
  lastPacketAt: number | null;
  team: number | null;
  slot: number | null;
  players: readonly ApNetworkPlayer[];
  games: Map<number, string>;
  checked: Set<number>;
  missing: Set<number>;
  itemsReceived: number;
}

export type { NetworkFacts };
