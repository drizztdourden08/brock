/* @layer electron-main @kind types */
import type { DataExportFormat, DataExportManifest } from '@drizztdourden08/brock-core/platform';
import type { DataDomains } from './domain-files.type';

type TransferReport = (domain: string, done: number, total: number) => void;

interface ExportRequest {
  domains: DataDomains;
  ids: readonly string[];
  format: DataExportFormat;
  target: string;
  app: Pick<DataExportManifest, 'app' | 'appVersion'>;
  report?: TransferReport;
  signal?: AbortSignal;
}

interface ImportSource {
  source: string;
  format: DataExportFormat;
  manifest: DataExportManifest;
}

interface ImportRequest {
  domains: DataDomains;
  from: ImportSource;
  ids: readonly string[];
  report?: TransferReport;
  signal?: AbortSignal;
}

export type { ExportRequest, ImportRequest, ImportSource, TransferReport };
