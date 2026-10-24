/* @layer electron-main @kind logic */
import { basename, join } from 'path';
import type { RecentDocument } from '@drizztdourden08/brock-core/platform';
import { writeAtomic } from '../storage/write-atomic';
import { pathKey } from './path-key';
import { readRecentEntries } from './recent-entries';
import { recentSigned } from './recent-signed';
import { signRecent } from './sign-recent';
import { MAX_RECENT_DOCUMENTS, RECENT_FILE } from './recent-documents.constants';
import type { RecentDeps, RecentDocuments, StoredRecent } from './recent-documents.type';

const plain = ({ path, name, lastOpened }: StoredRecent): RecentDocument => ({ path, name, lastOpened });

const createRecentDocuments = (deps: RecentDeps): RecentDocuments => {
  const now = deps.now ?? Date.now;
  const fileOf = (profileId: string): string => join(deps.profileDir(profileId), RECENT_FILE);
  const same = (a: string, b: string): boolean => pathKey(a) === pathKey(b);

  const load = async (profileId: string): Promise<StoredRecent[]> => {
    const key = await deps.key();
    const stored = await readRecentEntries(fileOf(profileId));
    return stored.filter((entry) => recentSigned(key, profileId, entry.path, entry.sig));
  };
  const save = (profileId: string, list: StoredRecent[]): Promise<void> => writeAtomic(fileOf(profileId), JSON.stringify(list));

  const list = async (profileId: string): Promise<RecentDocument[]> => {
    const stored = await load(profileId);
    const present = await Promise.all(stored.map((entry) => deps.exists(entry.path)));
    const kept = stored.filter((_entry, index) => present[index] === true);
    if (kept.length !== stored.length) await save(profileId, kept);
    return kept.map(plain);
  };

  const record = async (profileId: string, path: string): Promise<void> => {
    const sig = signRecent(await deps.key(), profileId, path);
    const entry: StoredRecent = { path, name: basename(path), lastOpened: now(), sig };
    const rest = (await load(profileId)).filter((other) => !same(other.path, path));
    await save(profileId, [entry, ...rest].slice(0, MAX_RECENT_DOCUMENTS));
    deps.os.add(path);
  };

  const clear = async (profileId: string): Promise<void> => {
    await save(profileId, []);
    deps.os.clear();
  };

  const reopen = async (profileId: string, path: string): Promise<string | null> => {
    const stored = await load(profileId);
    const hit = stored.find((entry) => same(entry.path, path));
    if (hit === undefined) throw new Error(`"${path}" is not in the recent documents list`);
    if (!(await deps.exists(hit.path))) {
      await save(profileId, stored.filter((entry) => entry !== hit));
      return null;
    }
    const full = deps.allow(hit.path);
    await record(profileId, full);
    return full;
  };

  return { list, record, clear, reopen };
};

export { createRecentDocuments };
