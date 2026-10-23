/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';
import { osRecent } from './os-recent';
import { pathExists } from './path-exists';
import { profileIdOf } from './profile-id-of';
import { createRecentDocuments } from './recent-documents';
import { createRecoverySnapshots } from './recovery-snapshots';
import type { DocumentTracking } from './document-tracking.type';

const createDocumentTracking = ({ paths, documents, log }: Pick<MainContext, 'paths' | 'documents' | 'log'>): DocumentTracking => {
  const profileDir = (profileId: string): string => paths.data('profiles', profileIdOf(profileId));
  const recent = createRecentDocuments({ profileDir, exists: pathExists, allow: documents.allow, os: osRecent });
  const recovery = createRecoverySnapshots({ profileDir });

  const quietly = async (profileId: unknown, work: (id: string) => Promise<void>): Promise<void> => {
    if (typeof profileId !== 'string') return;
    try {
      await work(profileIdOf(profileId));
    } catch (error) {
      log(`Document tracking:${error instanceof Error ? error.message : String(error)}`, 'warn');
    }
  };

  return {
    recent,
    recovery,
    opened: (profileId, full) => quietly(profileId, (id) => recent.record(id, full)),
    saved: (profileId, full) => quietly(profileId, async (id) => {
      await recent.record(id, full);
      await recovery.discardForPath(id, full);
    }),
  };
};

export { createDocumentTracking };
