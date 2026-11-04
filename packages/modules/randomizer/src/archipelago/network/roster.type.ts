/* @layer core @kind types */
import type { ApClientPacket } from '../protocol/client-packets.type';
import type { ApServerPacket } from '../protocol/server-packets.type';
import type { NetworkFacts } from './network-facts.type';
import type { Presence } from './presence.type';

interface RosterDeps {
  facts: NetworkFacts;
  presence: Presence;
  send(packet: ApClientPacket): void;
  isLinked(slot: number): boolean;
  onSettled(): void;
}

interface Roster {
  query(): void;
  received(packet: ApServerPacket): boolean;
  reset(): void;
}

export type { Roster, RosterDeps };
