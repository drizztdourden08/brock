/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { writeCachedGame } from '../data-package/write-cached-game';
import { adoptGames } from './adopt-games';
import type { PacketOf } from './packet-handlers.type';
import { sendConnect } from './send-connect';

const onDataPackage = (ctx: OnlineContext, packet: PacketOf<'DataPackage'>): void => {
  const games = packet.data?.games ?? {};
  const { cache } = ctx.deps;
  if (cache !== undefined) {
    for (const [game, data] of Object.entries(games)) writeCachedGame(cache, game, data);
  }
  adoptGames(ctx, games);
  sendConnect(ctx);
};

export { onDataPackage };
