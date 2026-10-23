/* @layer electron-main @kind types */
import type { SnapshotMeta } from '@drizztdourden08/brock-core/platform';

interface SnapshotArgs {
  key: string;
  data: Uint8Array;
  meta: SnapshotMeta;
}

export type { SnapshotArgs };
