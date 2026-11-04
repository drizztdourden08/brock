/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import type { ApGameData } from '../protocol/protocol.type';

const adoptGames = (ctx: OnlineContext, games: Record<string, ApGameData>): void => {
  const { names, room, game } = ctx;
  names.addGames(games);
  const own = games[game];
  if (own === undefined) return;
  room.gameData = own;
  room.itemNameById = new Map(Object.entries(own.item_name_to_id).map(([name, id]) => [id, name]));
};

export { adoptGames };
