/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { DATA_EXPORT_JOB, DATA_IMPORT_JOB, formatBytes } from '@drizztdourden08/brock-core';
import type { DataExportFormat, DataImportMode, DataImportPlan } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../../host/require-host-api';
import { jobs } from '../../../jobs/jobs';
import { confirmChoice } from '../../../stores/confirm-choice';
import { toast } from '../../../toast/toast';
import type { StorageActions } from '../StoragePage.type';
import { IMPORT_CHOICES } from './useStorageActions.constants';

const plural = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`;

const confirmImport = (plan: DataImportPlan): Promise<DataImportMode | null> => {
  const known = plan.domains.filter((entry) => entry.known);
  const from = plan.exportedAt ? ` from ${plan.exportedAt.slice(0, 10)}` : '';
  return confirmChoice<DataImportMode>({
    title: `Import ${known.map((entry) => entry.label).join(', ')}`,
    message: `The export${from} holds ${plural(known.reduce((sum, entry) => sum + entry.files, 0), 'file')}.`,
    confirmLabel: 'Import',
    choices: IMPORT_CHOICES,
    initial: 'merge',
  });
};

const importedText = (files: number, folders: number, kept: number): string =>
  `Imported ${plural(files, 'file')} into ${plural(folders, 'folder')}${kept > 0 ? `, kept ${plural(kept, 'newer file')}` : ''}`;

const useStorageActions = (refresh: (domain?: string) => void): StorageActions => useMemo(() => ({
  revealRoot: () => requireHostApi().revealDataFolder(),
  reveal: async (domain) => {
    const result = await requireHostApi().revealDataDomain(domain.domain);
    if (!result.success) toast(`Could not open ${domain.label}: ${result.error}`, { variant: 'danger' });
  },
  clean: async (domain, olderThanDays) => {
    const api = requireHostApi();
    const done = olderThanDays === null ? await api.clearDataDomain(domain.domain) : await api.cleanDataDomain(domain.domain, olderThanDays);
    toast(done.removed === 0 ? `${domain.label}: nothing to remove` : `${domain.label}: removed ${plural(done.removed, 'item')} (${formatBytes(done.bytes)})`, { variant: 'success' });
    refresh(domain.domain);
  },
  exportTo: async (format: DataExportFormat, domains) => {
    jobs.open(DATA_EXPORT_JOB);
    const done = await requireHostApi().exportDataDomains([...domains], format);
    if (done) toast(`Exported ${plural(done.files, 'file')} (${formatBytes(done.bytes)}) to ${done.path}`, { variant: 'success' });
    else jobs.hide();
  },
  importFrom: async (format: DataExportFormat) => {
    const api = requireHostApi();
    const plan = await api.pickDataImport(format);
    if (!plan) return;
    if (!plan.domains.some((entry) => entry.known)) {
      toast('This export holds no folder this app knows', { variant: 'warning' });
      return;
    }
    const mode = await confirmImport(plan);
    if (mode === null) return;
    jobs.open(DATA_IMPORT_JOB);
    const done = await api.applyDataImport(plan.token, plan.domains.filter((entry) => entry.known).map((entry) => entry.domain), mode);
    toast(importedText(done.files, done.domains.length, done.kept), { variant: 'success' });
    refresh();
  },
}), [refresh]);

export { useStorageActions };
