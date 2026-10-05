/* @layer core @kind types */
import type { DataDomainDef, DomainUsage } from '../platform/ports/storage.type';
import type { DataExportFormat, DataExportResult, DataImportMode, DataImportPlan, DataImportResult, DomainCleanResult, DomainEntry } from '../platform/ports/data-domain.type';
import type { Result } from '../result/result.type';
import type { JobSnapshot } from '../types/job.type';

interface DataInvokeContract {
  'storage:listDomains': () => Promise<DataDomainDef[]>;
  'storage:getDomainUsage': (domain: string) => Promise<DomainUsage>;
  'storage:revealDomain': (domain: string) => Promise<Result>;
  'storage:clearDomain': (domain: string) => Promise<DomainCleanResult>;
  'storage:cleanDomain': (domain: string, olderThanDays: number) => Promise<DomainCleanResult>;
  'storage:exportDomains': (domains: string[], format: DataExportFormat) => Promise<DataExportResult | null>;
  'storage:pickImport': (format: DataExportFormat) => Promise<DataImportPlan | null>;
  'storage:applyImport': (token: string, domains: string[], mode?: DataImportMode) => Promise<DataImportResult>;

  'domain:readJson': (domain: string, path: string) => Promise<unknown>;
  'domain:writeJson': (domain: string, path: string, value: unknown) => Promise<void>;
  'domain:readBytes': (domain: string, path: string) => Promise<ArrayBuffer | null>;
  'domain:writeBytes': (domain: string, path: string, data: ArrayBuffer) => Promise<void>;
  'domain:list': (domain: string, dir: string) => Promise<DomainEntry[]>;
  'domain:remove': (domain: string, path: string) => Promise<void>;
  'domain:size': (domain: string, path: string) => Promise<number>;

  'job:list': () => Promise<JobSnapshot[]>;
}

interface DataSendContract {
  'job:cancel': (id: string) => void;
  'job:dismiss': (id: string) => void;
}

interface DataEventContract {
  'job:update': (job: JobSnapshot) => void;
}

export type { DataEventContract, DataInvokeContract, DataSendContract };
