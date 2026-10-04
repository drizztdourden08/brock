/* @layer core @kind types */
interface DomainEntry {
  name: string;
  path: string;
  bytes: number;
  isDirectory: boolean;
  mtimeMs: number;
}

interface DomainCleanResult {
  domain: string;
  removed: number;
  bytes: number;
}

type DataExportFormat = 'zip' | 'folder';

interface DataExportResult {
  path: string;
  domains: string[];
  files: number;
  bytes: number;
}

interface DataManifestDomain {
  domain: string;
  label: string;
  files: number;
  bytes: number;
}

interface DataExportManifest {
  format: 'brock-data';
  version: 1;
  app: string;
  appVersion: string;
  exportedAt: string;
  domains: DataManifestDomain[];
}

interface DataImportDomain extends DataManifestDomain {
  known: boolean;
}

interface DataImportPlan {
  token: string;
  source: string;
  app: string | null;
  exportedAt: string | null;
  domains: DataImportDomain[];
}

interface DataImportResult {
  domains: string[];
  files: number;
}

export type {
  DataExportFormat, DataExportManifest, DataExportResult, DataImportDomain, DataImportPlan, DataImportResult, DataManifestDomain, DomainCleanResult, DomainEntry,
};
