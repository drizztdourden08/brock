/* @layer core @kind types */
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
  label: string;
  dir: string;
  description?: string;
  cleanOlderThanDays?: readonly number[];
  clearable?: boolean;
  portable?: boolean;
}

interface DomainUsage {
  domain: string;
  label: string;
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
