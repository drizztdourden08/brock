/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';
import { osRecent } from './os-recent';
import { folderExists } from './folder-exists';
import { pathExists } from './path-exists';
import { profileIdOf } from './profile-id-of';
import { createRecentDocuments } from './recent-documents';
import { createRecoverySnapshots } from './recovery-snapshots';
import { createRememberedFolders } from './remembered-folders';
import { createSigningKey } from './signing-key';
import type { DocumentTracking } from './document-tracking.type';

const createDocumentTracking = ({ paths, documents, log, profiles }: Pick<MainContext, 'paths' | 'documents' | 'log' | 'profiles'>): DocumentTracking => {
  const profileDir = (profileId: string): string => paths.data('profiles', profileIdOf(profileId));
  const key = createSigningKey(() => paths.userData('keys', 'recent-signing.key'));
  const recent = createRecentDocuments({ profileDir, exists: pathExists, allow: documents.allow, key, os: osRecent });
  const recovery = createRecoverySnapshots({ profileDir });
  const folders = createRememberedFolders({ profileDir, exists: folderExists, key });

  const profile = async (profileId: unknown): Promise<string> => {
    const id = profileIdOf(profileId);
    if ((await profiles.load(id)) === null) throw new Error(`"${id}" is not a profile`);
    return id;
  };

  const quietly = async (profileId: unknown, work: (id: string) => Promise<void>): Promise<void> => {
    if (typeof profileId !== 'string') return;
    try {
      await work(await profile(profileId));
    } catch (error) {
      log(`Document tracking:${error instanceof Error ? error.message : String(error)}`, 'warn');
    }
  };

  return {
    recent,
    recovery,
    folders,
    profile,
    opened: (profileId, full) => quietly(profileId, (id) => recent.record(id, full)),
    picked: (profileId, real) => quietly(profileId, (id) => folders.remember(id, real)),
    saved: (profileId, full, listed) => quietly(profileId, async (id) => {
      if (listed) await recent.record(id, full);
      await recovery.discardForPath(id, full);
    }),
  };
};

export { createDocumentTracking };
