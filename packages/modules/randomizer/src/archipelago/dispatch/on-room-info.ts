/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { splitByCache } from '../data-package/split-by-cache';
import { buildGetDataPackage } from '../handshake/build-get-data-package';
import { roomHashOf } from '../room/room-hash';
import { adoptGames } from './adopt-games';
import type { PacketOf } from './packet-handlers.type';
import { sendConnect } from './send-connect';

const onRoomInfo = (ctx: OnlineContext, packet: PacketOf<'RoomInfo'>): void => {
  const { room, game, deps } = ctx;
  room.roomInfo = packet;
  if (typeof packet.seed_name === 'string' && packet.seed_name !== '') room.roomHash = roomHashOf(packet.seed_name);
  const games = [...(Array.isArray(packet.games) ? packet.games : []), game];
  const { cached, missing } = deps.cache
    ? splitByCache(deps.cache, games, packet.datapackage_checksums)
    : { cached: {}, missing: [...new Set(games)] };
  adoptGames(ctx, cached);
  if (missing.length === 0) {
    sendConnect(ctx);
    return;
  }
  ctx.log(`[Online] Fetching data package for ${missing.length} game(s)`);
  ctx.send(buildGetDataPackage(missing));
};

export { onRoomInfo };
