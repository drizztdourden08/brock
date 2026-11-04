/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import type { PacketOf } from './packet-handlers.type';

const onBounced = (ctx: OnlineContext, packet: PacketOf<'Bounced'>): void => {
  ctx.bounced(packet);
};

export { onBounced };
