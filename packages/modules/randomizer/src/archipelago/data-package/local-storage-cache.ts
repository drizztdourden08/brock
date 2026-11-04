/* @layer core @kind logic */
import type { DataPackageCache } from './data-package-cache.type';
import { readStorage } from '../storage/read-storage';
import { writeStorage } from '../storage/write-storage';
import { cacheKey } from './cache-key';
import { KEY_PREFIX, LEGACY_KEY_PREFIX } from './data-package.constants';

const parseOrNull = (raw: string | null): unknown | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const createLocalStorageCache = (): DataPackageCache => ({
  read(game, checksum) {
    const current = readStorage(cacheKey(KEY_PREFIX, game, checksum));
    return parseOrNull(current ?? readStorage(cacheKey(LEGACY_KEY_PREFIX, game, checksum)));
  },
  write(game, checksum, pkg) {
    writeStorage(cacheKey(KEY_PREFIX, game, checksum), JSON.stringify(pkg));
  },
});

export { createLocalStorageCache };
