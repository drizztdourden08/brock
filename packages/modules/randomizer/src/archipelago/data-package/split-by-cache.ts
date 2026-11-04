/* @layer core @kind logic */
import type { ApGameData } from '../protocol/protocol.type';
import type { CacheSplit } from './data-package.type';
import type { DataPackageCache } from './data-package-cache.type';
import { readCachedGame } from './read-cached-game';

const splitByCache = (
  cache: DataPackageCache,
  games: readonly string[],
  checksums: Record<string, string> | undefined,
): CacheSplit => {
  const cached: Record<string, ApGameData> = {};
  const missing: string[] = [];
  for (const game of new Set(games)) {
    const checksum = checksums?.[game];
    const hit = checksum ? readCachedGame(cache, game, checksum) : null;
    if (hit) cached[game] = hit;
    else missing.push(game);
  }
  return { cached, missing };
};

export { splitByCache };
