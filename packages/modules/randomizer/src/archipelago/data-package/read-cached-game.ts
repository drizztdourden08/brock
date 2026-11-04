/* @layer core @kind logic */
import type { ApGameData } from '../protocol/protocol.type';
import type { DataPackageCache } from './data-package-cache.type';
import { isCachedGame } from './is-cached-game';

const readCachedGame = (cache: DataPackageCache, game: string, checksum: string): ApGameData | null => {
  try {
    const hit = cache.read(game, checksum);
    return isCachedGame(hit) ? hit : null;
  } catch {
    return null;
  }
};

export { readCachedGame };
