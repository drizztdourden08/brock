/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { DATA_EXPORT_JOB, DATA_IMPORT_JOB, formatBytes } from '@drizztdourden08/brock-core';
import type { DataExportFormat, DataImportPlan } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../../host/require-host-api';
import { jobs } from '../../../jobs/jobs';
import { confirmAction } from '../../../stores/confirm-action';
import { toast } from '../../../toast/toast';
import type { StorageActions } from '../StoragePage.type';

const plural = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`;

const confirmImport = (plan: DataImportPlan): Promise<boolean> => {
  const known = plan.domains.filter((entry) => entry.known);
  const from = plan.exportedAt ? ` from ${plan.exportedAt.slice(0, 10)}` : '';
  return confirmAction({
    title: `Replace ${known.map((entry) => entry.label).join(', ')}?`,
    message: `What is in these folders now is deleted and replaced with the export${from} (${plural(known.reduce((sum, entry) => sum + entry.files, 0), 'file')}).`,
    confirmLabel: 'Replace',
    variant: 'danger',
    focus: 'cancel',
  });
};

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
    if (!(await confirmImport(plan))) return;
    jobs.open(DATA_IMPORT_JOB);
    const done = await api.applyDataImport(plan.token, plan.domains.filter((entry) => entry.known).map((entry) => entry.domain));
    toast(`Imported ${plural(done.files, 'file')} into ${plural(done.domains.length, 'folder')}`, { variant: 'success' });
    refresh();
  },
}), [refresh]);

export { useStorageActions };
