/* @layer electron-main @kind types */
import type { RecoverableSnapshot, SnapshotMeta } from '@drizztdourden08/brock-core/platform';

interface RecoveryDeps {
  profileDir: (profileId: string) => string;
  now?: () => number;
}

interface RecoverySnapshots {
  save: (profileId: string, key: string, data: Uint8Array, meta: SnapshotMeta) => Promise<void>;
  list: (profileId: string) => Promise<RecoverableSnapshot[]>;
  read: (profileId: string, key: string) => Promise<Buffer | null>;
  discard: (profileId: string, key: string) => Promise<void>;
  discardForPath: (profileId: string, path: string) => Promise<void>;
}

export type { RecoveryDeps, RecoverySnapshots };
