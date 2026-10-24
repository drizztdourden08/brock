/* @layer electron-main @kind logic */
import { writeAtomic } from '../storage/write-atomic';
import { readRecentEntries } from './recent-entries';
import type { StoredRecent } from './recent-documents.type';
import type { SignedEntries, SignedEntriesDeps } from './signed-entries.type';

const createSignedEntries = ({ fileOf, key, signed, exists }: SignedEntriesDeps): SignedEntries => {
  const load = async (profileId: string): Promise<StoredRecent[]> => {
    const secret = await key();
    const stored = await readRecentEntries(fileOf(profileId));
    return stored.filter((entry) => signed(secret, profileId, entry.path, entry.sig));
  };
  const save = (profileId: string, list: StoredRecent[]): Promise<void> => writeAtomic(fileOf(profileId), JSON.stringify(list));

  const present = async (profileId: string): Promise<StoredRecent[]> => {
    const stored = await load(profileId);
    const found = await Promise.all(stored.map((entry) => exists(entry.path)));
    const kept = stored.filter((_entry, index) => found[index] === true);
    if (kept.length !== stored.length) await save(profileId, kept);
    return kept;
  };

  return { load, save, present };
};

export { createSignedEntries };
