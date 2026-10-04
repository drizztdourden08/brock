/* @layer electron-main @kind logic */
import { readdir } from 'fs/promises';
import { join, relative, sep } from 'path';
import type { DomainEntry } from '@drizztdourden08/brock-core/platform';
import { mapLimit } from './map-limit';
import { pathBytes } from './path-bytes';
import { STAT_LANES } from './storage.constants';
import { newestChange } from './newest-change';

const names = async (dir: string): Promise<string[]> => {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
};

const listEntries = async (root: string, dir: string): Promise<DomainEntry[]> => {
  const found = (await names(dir)).sort();
  return mapLimit(found, STAT_LANES, async (name) => {
    const full = join(dir, name);
    const { isDirectory, mtimeMs } = await newestChange(full);
    return { name, path: relative(root, full).split(sep).join('/'), bytes: await pathBytes(full), isDirectory, mtimeMs };
  });
};

export { listEntries };
