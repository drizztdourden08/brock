/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { acceptsRoom } from '../room/accepts-room';
import { deliverOne } from './deliver-one';
import type { PacketOf } from './packet-handlers.type';
import { receivedItemsOf } from './received-items-of';
import { requestSync } from './request-sync';
import { resyncWhenReady } from './resync-when-ready';

const FIRST_INDEX = 0;

const receiveItems = (ctx: OnlineContext, packet: PacketOf<'ReceivedItems'>): void => {
  const { room, host, deps } = ctx;
  if (!ctx.isLive() || !acceptsRoom(ctx)) return;
  if (packet.index === FIRST_INDEX) room.syncPending = false;
  if (!host.isFileInPlay()) {
    resyncWhenReady(ctx, 'No save in play');
    return;
  }
  if (packet.index > deps.received.next() && !room.syncPending) {
    requestSync(ctx, 'Gap in received items');
    return;
  }
  const fresh = receivedItemsOf(ctx, packet).filter((item) => deps.received.isNew(item.index));
  const ordered = deps.order ? deps.order(fresh) : fresh;
  let handedOn = 0;
  for (const item of ordered) {
    if (deliverOne(ctx, item) === 'stop') {
      ctx.log(`[Online] The game cannot take items right now; ${handedOn} of the server's items handed on`);
      resyncWhenReady(ctx, 'Game ready');
      return;
    }
    handedOn += 1;
  }
};

export { receiveItems };
