/* @layer electron-main @kind logic */
import type { Dirent } from 'fs';
import { extname } from 'path';
import type { DocumentEntry, DocumentListing } from '@drizztdourden08/brock-core/platform';
import { mapLimit } from '../storage/map-limit';
import { STAT_LANES } from '../storage/storage.constants';
import { describeEntry } from './describe-entry';
import { LIST_REVOKED } from './list-limits.constants';
import type { ListLimits } from './list-limits.type';
import type { ListWalk } from './list-folder.type';
import type { ListSettings } from './list-options.type';
import { readCapped } from './read-capped';

const wanted = (entry: DocumentEntry, { extensions }: ListSettings): boolean =>
  extensions === null || (entry.kind === 'file' && extensions.has(extname(entry.name).slice(1).toLowerCase()));

const byName = (a: { name: string }, b: { name: string }): number => a.name.toLowerCase().localeCompare(b.name.toLowerCase()) || a.name.localeCompare(b.name);

const readLevel = async (dir: string, state: ListWalk): Promise<Dirent[] | null> => {
  if (!state.live()) throw new Error(LIST_REVOKED);
  const room = state.limits.entries - state.seen;
  if (room <= 0 || Date.now() >= state.deadline) {
    state.truncated = true;
    return null;
  }
  const read = await readCapped(dir, room + 1);
  if (read.length > room) state.truncated = true;
  const dirents = read.slice(0, room).sort(byName);
  state.seen += dirents.length;
  return dirents;
};

const descends = (entry: DocumentEntry, { recursive }: ListSettings): boolean => recursive && entry.kind === 'folder' && !entry.link;

const walk = async (dir: string, depth: number, state: ListWalk): Promise<void> => {
  const dirents = await readLevel(dir, state);
  if (dirents === null) return;
  const described = await mapLimit(dirents, STAT_LANES, (dirent) => describeEntry(dir, dirent, state.covers));
  for (const entry of described) {
    if (entry === null) continue;
    if (wanted(entry, state.settings)) state.found.push(entry);
    if (!descends(entry, state.settings)) continue;
    if (depth + 1 >= state.limits.depth) state.truncated = true;
    else await walk(entry.path, depth + 1, state);
  }
};

const listFolder = async (dir: string, settings: ListSettings, limits: ListLimits, access: Pick<ListWalk, 'covers' | 'live'>): Promise<DocumentListing> => {
  const state: ListWalk = { settings, limits, ...access, deadline: Date.now() + limits.ms, seen: 0, found: [], truncated: false };
  await walk(dir, 0, state);
  return { entries: state.found, truncated: state.truncated };
};

export { listFolder };
