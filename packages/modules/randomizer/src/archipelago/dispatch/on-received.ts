/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import type { PacketOf } from './packet-handlers.type';
import { receiveItems } from './receive-items';

const onReceivedItems = (ctx: OnlineContext, packet: PacketOf<'ReceivedItems'>): void => {
  if (!ctx.room.scouted) {
    ctx.room.heldReceived.push(packet);
    return;
  }
  receiveItems(ctx, packet);
};

export { onReceivedItems };
