/* @layer core @kind types */
import type { SlotReading } from '../client/online-host.type';
import type { ApGameData, ApNetworkPlayer } from '../protocol/protocol.type';
import type { ApReceivedItemsPacket, ApRoomInfoPacket } from '../protocol/server-packets.type';

interface OnlineRoom {
  roomInfo: ApRoomInfoPacket | null;
  roomHash: string;
  connected: boolean;
  heldReceived: ApReceivedItemsPacket[];
  syncPending: boolean;
  resyncWait: (() => void) | null;
  gameData: ApGameData | null;
  itemNameById: Map<number, string>;
  team: number | null;
  slot: number | null;
  players: ApNetworkPlayer[];
  reading: Extract<SlotReading<unknown>, { kind: 'ok' }> | null;
  checked: Set<number>;
  missing: Set<number>;
  reportedLocal: Set<number>;
  serverGrants: Set<number>;
  scoutIds: number[];
  scouted: boolean;
}

export type { OnlineRoom };
