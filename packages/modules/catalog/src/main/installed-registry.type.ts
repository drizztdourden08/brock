/* @layer electron-main @kind types */
import type { InstalledRecord } from '../catalog.type';

interface RegistryFile {
  version: 1;
  records: InstalledRecord[];
}

interface InstalledRegistry {
  list: () => Promise<InstalledRecord[]>;
  get: (itemId: string) => Promise<InstalledRecord | null>;
  put: (record: InstalledRecord) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
}

export type { RegistryFile, InstalledRegistry };
