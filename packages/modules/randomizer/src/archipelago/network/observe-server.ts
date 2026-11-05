/* @layer core @kind logic */
import type { ApVersion } from '../protocol/protocol.type';
import type {
  ApConnectedPacket, ApLocationInfoPacket, ApReceivedItemsPacket, ApRoomInfoPacket, ApRoomUpdatePacket, ApServerPacket,
} from '../protocol/server-packets.type';
import type { NetworkFacts } from './network-facts.type';
import { wireList } from './wire-list';

const versionText = (version: ApVersion | undefined): string | null =>
  (version && typeof version.major === 'number' ? `${version.major}.${version.minor}.${version.build}` : null);

const observeRoomInfo = (facts: NetworkFacts, packet: ApRoomInfoPacket): void => {
  facts.seedName = packet.seed_name ?? null;
  facts.serverVersion = versionText(packet.version);
  facts.tags = wireList(packet.tags);
};

const gamesOf = (packet: ApConnectedPacket): Map<number, string> => {
  const games = new Map<number, string>();
  for (const [slot, info] of Object.entries(packet.slot_info ?? {})) games.set(Number(slot), info.game);
  return games;
};

const observeConnected = (facts: NetworkFacts, packet: ApConnectedPacket): void => {
  facts.connection = 'connected';
  facts.team = packet.team;
  facts.slot = packet.slot;
  facts.players = wireList(packet.players);
  facts.games = gamesOf(packet);
  facts.checked = new Set(wireList(packet.checked_locations));
  facts.missing = new Set(wireList(packet.missing_locations));
  facts.hintPoints = packet.hint_points ?? null;
  facts.reconnectAttempt = 0;
  facts.nextRetryAt = null;
  facts.retryInFlight = false;
};

const observeRoomUpdate = (facts: NetworkFacts, packet: ApRoomUpdatePacket): void => {
  if (Array.isArray(packet.players)) facts.players = packet.players;
  if (typeof packet.hint_points === 'number') facts.hintPoints = packet.hint_points;
  for (const id of wireList(packet.checked_locations)) {
    facts.checked.add(id);
    facts.missing.delete(id);
  }
};

const observeLocationInfo = (facts: NetworkFacts, packet: ApLocationInfoPacket): void => {
  for (const entry of wireList(packet.locations)) facts.scoutOwners.set(entry.location, entry.player);
};

const observeReceived = (facts: NetworkFacts, packet: ApReceivedItemsPacket): void => {
  facts.itemsReceived = Math.max(facts.itemsReceived, packet.index + wireList(packet.items).length);
};

const observeServer = (facts: NetworkFacts, packet: ApServerPacket, now: number): void => {
  facts.lastPacketAt = now;
  if (packet.cmd === 'RoomInfo') observeRoomInfo(facts, packet);
  else if (packet.cmd === 'Connected') observeConnected(facts, packet);
  else if (packet.cmd === 'RoomUpdate') observeRoomUpdate(facts, packet);
  else if (packet.cmd === 'LocationInfo') observeLocationInfo(facts, packet);
  else if (packet.cmd === 'ReceivedItems') observeReceived(facts, packet);
};

export { observeServer };
