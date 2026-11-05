/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { connectTags } from '../handshake/connect-tags';
import { ITEMS_HANDLING_ALL } from '../handshake/handshake.constants';

const applySlotDeathLink = (ctx: OnlineContext): void => {
  const wanted = ctx.room.reading?.deathLink;
  if (wanted === undefined) return;
  ctx.setDeathLink(wanted);
  ctx.send({ cmd: 'ConnectUpdate', items_handling: ITEMS_HANDLING_ALL, tags: connectTags(wanted) });
};

export { applySlotDeathLink };
