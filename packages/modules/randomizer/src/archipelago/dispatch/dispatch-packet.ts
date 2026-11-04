/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import type { ApServerPacket } from '../protocol/server-packets.type';
import { PACKET_HANDLERS } from './packet-handlers.constants';

const dispatchPacket = (ctx: OnlineContext, packet: ApServerPacket): void => {
  PACKET_HANDLERS[packet.cmd]?.(ctx, packet);
};

export { dispatchPacket };
