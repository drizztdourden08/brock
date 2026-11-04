/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { requestSync } from './request-sync';

const resyncWhenReady = (ctx: OnlineContext, reason: string): void => {
  const { room, host } = ctx;
  if (room.resyncWait !== null) return;
  const unsubscribe = host.onDeliveryReady(() => {
    unsubscribe();
    room.resyncWait = null;
    if (ctx.isLive()) requestSync(ctx, reason);
  });
  room.resyncWait = unsubscribe;
};

export { resyncWhenReady };
