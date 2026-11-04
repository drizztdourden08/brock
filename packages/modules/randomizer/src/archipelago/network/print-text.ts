/* @layer core @kind logic */
import type { ApPrintJsonPacket } from '../protocol/server-packets.type';

const printText = (packet: ApPrintJsonPacket): string =>
  (Array.isArray(packet.data) ? packet.data.map((part) => part.text ?? '').join('') : '');

export { printText };
