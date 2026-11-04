/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { ROOM_MISMATCH } from './room-identity.constants';

const acceptsRoom = (ctx: OnlineContext): boolean => {
  const saved = ctx.host.readCursor()?.roomHash ?? '';
  const { roomHash } = ctx.room;
  if (saved === '' || roomHash === '' || saved === roomHash) return true;
  ctx.fail(ROOM_MISMATCH);
  return false;
};

export { acceptsRoom };
