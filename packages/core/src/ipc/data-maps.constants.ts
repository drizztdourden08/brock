/* @layer core @kind constants */
import type { DataEventContract, DataInvokeContract, DataSendContract } from './data-contract.type';

const DATA_INVOKE_MAP = {
  listDataDomains: 'storage:listDomains',
  getDomainUsage: 'storage:getDomainUsage',
  revealDataDomain: 'storage:revealDomain',
  clearDataDomain: 'storage:clearDomain',
  cleanDataDomain: 'storage:cleanDomain',
  exportDataDomains: 'storage:exportDomains',
  pickDataImport: 'storage:pickImport',
  applyDataImport: 'storage:applyImport',
  domainReadJson: 'domain:readJson',
  domainWriteJson: 'domain:writeJson',
  domainReadBytes: 'domain:readBytes',
  domainWriteBytes: 'domain:writeBytes',
  domainList: 'domain:list',
  domainRemove: 'domain:remove',
  domainSize: 'domain:size',
  listJobs: 'job:list',
} as const satisfies Record<string, keyof DataInvokeContract>;

const DATA_SEND_MAP = {
  cancelJob: 'job:cancel',
  dismissJob: 'job:dismiss',
} as const satisfies Record<string, keyof DataSendContract>;

const DATA_EVENT_MAP = {
  onJobUpdate: 'job:update',
} as const satisfies Record<string, keyof DataEventContract>;

export { DATA_EVENT_MAP, DATA_INVOKE_MAP, DATA_SEND_MAP };
