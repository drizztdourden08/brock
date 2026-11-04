/* @layer core @kind logic */
import type { ApPrintJsonPacket } from '../protocol/server-packets.type';
import { NON_GAME_PART, NON_GAME_TAGS } from './presence.constants';
import { printText } from './print-text';

const isNonGameClient = (packet: ApPrintJsonPacket): boolean => (packet.type === 'Join'
  ? (packet.tags ?? []).some((tag) => NON_GAME_TAGS.includes(tag))
  : NON_GAME_PART.test(printText(packet)));

export { isNonGameClient };
