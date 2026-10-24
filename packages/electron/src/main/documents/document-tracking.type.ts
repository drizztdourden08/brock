/* @layer electron-main @kind types */
import type { RecentDocuments } from './recent-documents.type';
import type { RecoverySnapshots } from './recovery-snapshots.type';
import type { RememberedFolders } from './remembered-folders.type';

interface DocumentTracking {
  recent: RecentDocuments;
  recovery: RecoverySnapshots;
  folders: RememberedFolders;
  profile: (profileId: unknown) => Promise<string>;
  opened: (profileId: unknown, path: string) => Promise<void>;
  picked: (profileId: unknown, real: string) => Promise<void>;
  saved: (profileId: unknown, path: string, listed: boolean) => Promise<void>;
}

export type { DocumentTracking };
