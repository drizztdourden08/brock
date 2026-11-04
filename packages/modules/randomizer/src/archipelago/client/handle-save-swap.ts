/* @layer core @kind logic */
import { requestSync } from '../dispatch/request-sync';
import { bindSaveToRoom } from '../room/bind-save-to-room';
import type { OnlineContext } from './online-context.type';

const handleSaveSwap = (ctx: OnlineContext): void => {
  const { room, host, deps } = ctx;
  host.cancelDeliveries();
  deps.received.reset();
  room.resyncWait?.();
  room.resyncWait = null;
  room.syncPending = false;
  if (!ctx.isLive() || !bindSaveToRoom(ctx)) return;
  requestSync(ctx, 'Save changed');
};

export { handleSaveSwap };
