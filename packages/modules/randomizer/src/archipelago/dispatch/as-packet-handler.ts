/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import type { ApServerPacket } from '../protocol/server-packets.type';
import type { PacketHandler } from './packet-handlers.type';

const asPacketHandler = <P extends ApServerPacket>(
  handler: (ctx: OnlineContext, packet: P) => void,
): PacketHandler => handler as PacketHandler;

export { asPacketHandler };
