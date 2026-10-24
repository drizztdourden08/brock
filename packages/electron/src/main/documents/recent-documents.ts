/* @layer electron-main @kind logic */
import { basename, join } from 'path';
import type { RecentDocument } from '@drizztdourden08/brock-core/platform';
import { pathKey } from './path-key';
import { recentSigned } from './recent-signed';
import { signRecent } from './sign-recent';
import { createSignedEntries } from './signed-entries';
import { MAX_RECENT_DOCUMENTS, RECENT_FILE } from './recent-documents.constants';
import type { RecentDeps, RecentDocuments, StoredRecent } from './recent-documents.type';

const plain = ({ path, name, lastOpened }: StoredRecent): RecentDocument => ({ path, name, lastOpened });

const createRecentDocuments = (deps: RecentDeps): RecentDocuments => {
  const now = deps.now ?? Date.now;
  const same = (a: string, b: string): boolean => pathKey(a) === pathKey(b);
  const entries = createSignedEntries({
    fileOf: (profileId) => join(deps.profileDir(profileId), RECENT_FILE),
    key: deps.key,
    signed: recentSigned,
    exists: deps.exists,
  });

  const list = async (profileId: string): Promise<RecentDocument[]> => (await entries.present(profileId)).map(plain);

  const record = async (profileId: string, path: string): Promise<void> => {
    const sig = signRecent(await deps.key(), profileId, path);
    const entry: StoredRecent = { path, name: basename(path), lastOpened: now(), sig };
    const rest = (await entries.load(profileId)).filter((other) => !same(other.path, path));
    await entries.save(profileId, [entry, ...rest].slice(0, MAX_RECENT_DOCUMENTS));
    deps.os.add(path);
  };

  const clear = async (profileId: string): Promise<void> => {
    await entries.save(profileId, []);
    deps.os.clear();
  };

  const reopen = async (profileId: string, path: string): Promise<string | null> => {
    const stored = await entries.load(profileId);
    const hit = stored.find((entry) => same(entry.path, path));
    if (hit === undefined) throw new Error(`"${path}" is not in the recent documents list`);
    if (!(await deps.exists(hit.path))) {
      await entries.save(profileId, stored.filter((entry) => entry !== hit));
      return null;
    }
    const full = deps.allow(hit.path);
    await record(profileId, full);
    return full;
  };

  return { list, record, clear, reopen };
};

export { createRecentDocuments };
