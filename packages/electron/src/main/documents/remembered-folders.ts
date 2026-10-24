/* @layer electron-main @kind logic */
import { basename, join } from 'path';
import type { RememberedFolder } from '@drizztdourden08/brock-core/platform';
import { folderSigned } from './folder-signed';
import { pathKey } from './path-key';
import type { StoredRecent } from './recent-documents.type';
import { MAX_REMEMBERED_FOLDERS, REMEMBERED_FILE } from './remembered-folders.constants';
import type { RememberedDeps, RememberedFolders } from './remembered-folders.type';
import { signFolder } from './sign-folder';
import { createSignedEntries } from './signed-entries';

const plain = ({ path, name, lastOpened }: StoredRecent): RememberedFolder => ({ path, name, lastOpened });

const createRememberedFolders = (deps: RememberedDeps): RememberedFolders => {
  const now = deps.now ?? Date.now;
  const same = (a: string, b: string): boolean => pathKey(a) === pathKey(b);
  const entries = createSignedEntries({
    fileOf: (profileId) => join(deps.profileDir(profileId), REMEMBERED_FILE),
    key: deps.key,
    signed: folderSigned,
    exists: deps.exists,
  });

  const list = async (profileId: string): Promise<RememberedFolder[]> => (await entries.present(profileId)).map(plain);

  const find = async (profileId: string, path: string): Promise<string | null> =>
    (await entries.load(profileId)).find((entry) => same(entry.path, path))?.path ?? null;

  const remember = async (profileId: string, real: string): Promise<void> => {
    const sig = signFolder(await deps.key(), profileId, real);
    const entry: StoredRecent = { path: real, name: basename(real), lastOpened: now(), sig };
    const rest = (await entries.load(profileId)).filter((other) => !same(other.path, real));
    await entries.save(profileId, [entry, ...rest].slice(0, MAX_REMEMBERED_FOLDERS));
  };

  const forget = async (profileId: string, path: string): Promise<boolean> => {
    const stored = await entries.load(profileId);
    const kept = stored.filter((entry) => !same(entry.path, path));
    if (kept.length === stored.length) return false;
    await entries.save(profileId, kept);
    return true;
  };

  return { list, find, remember, forget };
};

export { createRememberedFolders };
