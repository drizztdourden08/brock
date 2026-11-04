/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';

const adoptRoom = (ctx: OnlineContext): void => {
  const { roomHash } = ctx.room;
  const cursor = ctx.host.readCursor();
  if (roomHash === '' || (cursor?.roomHash ?? '') !== '') return;
  ctx.host.writeCursor({ index: cursor?.index ?? 0, roomHash });
};

export { adoptRoom };
