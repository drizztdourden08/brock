/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { NO_HINT } from './dispatch.constants';

const scoutOnce = (ctx: OnlineContext): void => {
  const { room } = ctx;
  if (room.scouted || room.scoutIds.length > 0) return;
  room.scoutIds = [...room.checked, ...room.missing];
  if (room.scoutIds.length === 0) return;
  ctx.log(`[Online] Scouting ${room.scoutIds.length} locations`);
  ctx.send({ cmd: 'LocationScouts', locations: room.scoutIds, create_as_hint: NO_HINT });
};

export { scoutOnce };
