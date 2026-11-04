/* @layer core @kind logic */
import type { ApGameData } from '../protocol/protocol.type';
import type { DataPackageCache } from './data-package-cache.type';

const writeCachedGame = (cache: DataPackageCache, game: string, data: ApGameData): void => {
  if (!data.checksum) return;
  try {
    cache.write(game, data.checksum, data);
  } catch {
    return undefined;
  }
};

export { writeCachedGame };
