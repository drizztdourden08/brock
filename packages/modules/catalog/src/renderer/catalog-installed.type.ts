/* @layer renderer-shell @kind types */
import type { InstalledRecord } from '../catalog.type';

interface CatalogInstalledState {
  records: InstalledRecord[];
  reload: () => Promise<void>;
  watch: () => void;
}

export type { CatalogInstalledState };
