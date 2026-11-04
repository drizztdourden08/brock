/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { receiveItems } from './receive-items';

const releaseHeldReceived = (ctx: OnlineContext): void => {
  const held = ctx.room.heldReceived;
  ctx.room.heldReceived = [];
  for (const packet of held) receiveItems(ctx, packet);
};

export { releaseHeldReceived };
