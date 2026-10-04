/* @layer electron-main @kind logic */
import { readdir, rm } from 'fs/promises';
import { join } from 'path';
import { mapLimit } from './map-limit';
import { newestChange } from './newest-change';
import { pathBytes } from './path-bytes';
import { STAT_LANES } from './storage.constants';
import type { CleanCount } from './storage.type';

const topEntries = async (dir: string): Promise<string[]> => {
  try {
    return (await readdir(dir)).map((name) => join(dir, name));
  } catch {
    return [];
  }
};

const removeAll = async (paths: readonly string[]): Promise<CleanCount> => {
  const sizes = await mapLimit(paths, STAT_LANES, async (full) => {
    const bytes = await pathBytes(full);
    await rm(full, { recursive: true, force: true });
    return bytes;
  });
  return { removed: paths.length, bytes: sizes.reduce((sum, bytes) => sum + bytes, 0) };
};

const cleanDir = async (dir: string, olderThanMs: number | null, now = Date.now()): Promise<CleanCount> => {
  const entries = await topEntries(dir);
  if (olderThanMs === null) return removeAll(entries);
  const cutoff = now - olderThanMs;
  const changes = await mapLimit(entries, STAT_LANES, newestChange);
  return removeAll(entries.filter((_, index) => (changes[index]?.mtimeMs ?? now) < cutoff));
};

export { cleanDir };
