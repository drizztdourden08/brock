/* @layer core @kind types */
import type { Text } from '../../i18n/text.type';

interface FileStat {
  bytes: number;
  isDirectory: boolean;
  mtimeMs: number;
}

interface DataLocation {
  path: string;
  osLabel: string;
  canReveal: boolean;
}

interface DataDomainDef {
  domain: string;
  label: Text;
  dir: string;
  description?: Text;
  cleanOlderThanDays?: readonly number[];
  clearable?: boolean;
  portable?: boolean;
}

interface DomainUsage {
  domain: string;
  label: Text;
  count: number;
  bytes: number;
}

interface StorageSummary {
  location: DataLocation;
  domains: DomainUsage[];
  totalBytes: number;
}

interface StoragePort {
  getLocation: () => Promise<DataLocation>;
  reveal: () => Promise<void>;
  revealProfile: (profileId: string) => Promise<boolean>;
  getSummary: () => Promise<StorageSummary>;
  revealLogs?: () => Promise<void>;
}

export type { FileStat, DataLocation, DataDomainDef, DomainUsage, StorageSummary, StoragePort };
