/* @layer core @kind logic */
import type { ApPrintJsonPacket } from '../protocol/server-packets.type';
import { NON_GAME_PART, NON_GAME_TAGS } from './non-game-client.constants';

const textOf = (packet: ApPrintJsonPacket): string =>
  Array.isArray(packet.data) ? packet.data.map((part) => part.text ?? '').join('') : '';

const isNonGameClient = (packet: ApPrintJsonPacket): boolean =>
  packet.type === 'Join'
    ? (packet.tags ?? []).some((tag) => NON_GAME_TAGS.includes(tag))
    : NON_GAME_PART.test(textOf(packet));

export { isNonGameClient };
