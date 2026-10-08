/* @layer renderer-shell @kind types */
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';
import type { InstalledRecord } from '../catalog.type';

interface CatalogItemState {
  record: InstalledRecord | null;
  job: JobSnapshot | null;
  running: boolean;
  hasUpdate: boolean;
  error: string | null;
  signedOut: boolean;
  install: (version?: number | null) => Promise<void>;
  uninstall: () => Promise<void>;
  cancel: () => void;
}

export type { CatalogItemState };
