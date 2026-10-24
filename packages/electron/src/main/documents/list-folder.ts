/* @layer electron-main @kind logic */
import { readdir } from 'fs/promises';
import { extname } from 'path';
import type { DocumentEntry } from '@drizztdourden08/brock-core/platform';
import { mapLimit } from '../storage/map-limit';
import { STAT_LANES } from '../storage/storage.constants';
import { describeEntry } from './describe-entry';
import type { ListSettings } from './list-options.type';

const wanted = (entry: DocumentEntry, { extensions }: ListSettings): boolean =>
  extensions === null || (entry.kind === 'file' && extensions.has(extname(entry.name).slice(1).toLowerCase()));

const byName = (a: { name: string }, b: { name: string }): number => a.name.toLowerCase().localeCompare(b.name.toLowerCase()) || a.name.localeCompare(b.name);

const listFolder = async (dir: string, settings: ListSettings, covers: (real: string) => boolean): Promise<DocumentEntry[]> => {
  const dirents = (await readdir(dir, { withFileTypes: true })).sort(byName);
  const described = await mapLimit(dirents, STAT_LANES, (dirent) => describeEntry(dir, dirent, covers));
  const found: DocumentEntry[] = [];
  for (const entry of described) {
    if (entry === null) continue;
    if (wanted(entry, settings)) found.push(entry);
    if (settings.recursive && entry.kind === 'folder' && !entry.link) found.push(...(await listFolder(entry.path, settings, covers)));
  }
  return found;
};

export { listFolder };
