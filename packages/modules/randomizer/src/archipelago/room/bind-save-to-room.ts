/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { acceptsRoom } from './accepts-room';
import { adoptRoom } from './adopt-room';

const bindSaveToRoom = (ctx: OnlineContext): boolean => {
  if (!ctx.host.isFileInPlay()) return true;
  if (!acceptsRoom(ctx)) return false;
  adoptRoom(ctx);
  return true;
};

export { bindSaveToRoom };
