/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';

const requestSync = (ctx: OnlineContext, reason: string): void => {
  const { room } = ctx;
  if (room.syncPending) return;
  room.syncPending = true;
  ctx.log(`[Online] ${reason}, asking the server for the full list`);
  ctx.send({ cmd: 'Sync' });
};

export { requestSync };
