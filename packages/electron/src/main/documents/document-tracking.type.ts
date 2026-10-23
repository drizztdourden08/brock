/* @layer electron-main @kind types */
import type { RecentDocuments } from './recent-documents.type';
import type { RecoverySnapshots } from './recovery-snapshots.type';

interface DocumentTracking {
  recent: RecentDocuments;
  recovery: RecoverySnapshots;
  opened: (profileId: unknown, path: string) => Promise<void>;
  saved: (profileId: unknown, path: string) => Promise<void>;
}

export type { DocumentTracking };
