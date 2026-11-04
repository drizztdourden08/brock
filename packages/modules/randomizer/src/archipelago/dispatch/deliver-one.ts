/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import type { ReceivedItem } from '../client/online-host.type';
import type { DeliverStep } from './deliver-one.type';

const settleNow = (ctx: OnlineContext, item: ReceivedItem): void => {
  const { received } = ctx.deps;
  const epoch = received.epoch();
  received.hand(item.index);
  received.settle(item.index, epoch);
};

const isOwnEcho = (ctx: OnlineContext, item: ReceivedItem): boolean =>
  item.player === ctx.room.slot && ctx.room.serverGrants.has(item.location);

const deliverOne = (ctx: OnlineContext, item: ReceivedItem): DeliverStep => {
  if (isOwnEcho(ctx, item)) {
    ctx.log(`[Online] Own pickup at location ${item.location} echoed back, already granted in-world`);
    settleNow(ctx, item);
    return 'next';
  }
  const result = ctx.host.deliver(item);
  if (result === 'not-ready') return 'stop';
  if (result === 'unknown') {
    ctx.log(`[Online] Unknown received item ${item.item} from ${item.senderName}, skipped`, 'warn');
    settleNow(ctx, item);
    return 'next';
  }
  ctx.deps.received.hand(item.index);
  ctx.log(`[Online] Received: ${item.itemName} from ${item.senderName}`);
  ctx.emit({ type: 'item-received', item, own: item.player === ctx.room.slot });
  return 'next';
};

export { deliverOne };
