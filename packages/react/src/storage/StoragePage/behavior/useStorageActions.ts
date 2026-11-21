/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { DATA_EXPORT_JOB, DATA_IMPORT_JOB, formatBytes } from '@drizztdourden08/brock-core';
import type { DataExportFormat, DataImportMode, DataImportPlan } from '@drizztdourden08/brock-core';
import { useText } from '../../../i18n';
import { requireHostApi } from '../../../host/require-host-api';
import { jobs } from '../../../jobs/jobs';
import { confirmChoice } from '../../../stores/confirm-choice';
import { toast } from '../../../toast/toast';
import type { StorageActions } from '../StoragePage.type';
import { IMPORT_CHOICES } from './useStorageActions.constants';

const confirmImport = (plan: DataImportPlan): Promise<DataImportMode | null> => {
  const known = plan.domains.filter((entry) => entry.known);
  const count = known.reduce((sum, entry) => sum + entry.files, 0);
  return confirmChoice<DataImportMode>({
    title: msg('brock-shell:storage.import.confirmTitle', { names: known.map((entry) => entry.label).join(', ') }),
    message: plan.exportedAt
      ? msg('brock-shell:storage.import.confirmMessageFrom', { date: plan.exportedAt.slice(0, 10), count })
      : msg('brock-shell:storage.import.confirmMessage', { count }),
    confirmLabel: msg('brock-shell:storage.import.confirm'),
    choices: IMPORT_CHOICES,
    initial: 'merge',
  });
};

const importedText = (files: number, folders: number, kept: number): Text =>
  msg(kept > 0 ? 'brock-shell:storage.import.doneKept' : 'brock-shell:storage.import.done', { files, folders, kept });

const storageActions = (refresh: (domain?: string) => void, text: (value: Text) => string): StorageActions => ({
  revealRoot: () => requireHostApi().revealDataFolder(),
  reveal: async (domain) => {
    const result = await requireHostApi().revealDataDomain(domain.domain);
    if (!result.success) toast(msg('brock-shell:storage.reveal.failed', { name: text(domain.label), error: result.error ?? '' }), { variant: 'danger' });
  },
  clean: async (domain, olderThanDays) => {
    const api = requireHostApi();
    const done = olderThanDays === null ? await api.clearDataDomain(domain.domain) : await api.cleanDataDomain(domain.domain, olderThanDays);
    const name = text(domain.label);
    toast(done.removed === 0 ? msg('brock-shell:storage.clean.none', { name }) : msg('brock-shell:storage.clean.done', { name, count: done.removed, size: formatBytes(done.bytes) }), { variant: 'success' });
    refresh(domain.domain);
  },
  exportTo: async (format: DataExportFormat, domains) => {
    jobs.open(DATA_EXPORT_JOB);
    const done = await requireHostApi().exportDataDomains([...domains], format);
    if (done) toast(msg('brock-shell:storage.export.done', { count: done.files, size: formatBytes(done.bytes), path: done.path }), { variant: 'success' });
    else jobs.hide();
  },
  importFrom: async (format: DataExportFormat) => {
    const api = requireHostApi();
    const plan = await api.pickDataImport(format);
    if (!plan) return;
    if (!plan.domains.some((entry) => entry.known)) {
      toast(msg('brock-shell:storage.import.none'), { variant: 'warning' });
      return;
    }
    const mode = await confirmImport(plan);
    if (mode === null) return;
    jobs.open(DATA_IMPORT_JOB);
    const done = await api.applyDataImport(plan.token, plan.domains.filter((entry) => entry.known).map((entry) => entry.domain), mode);
    toast(importedText(done.files, done.domains.length, done.kept), { variant: 'success' });
    refresh();
  },
});

const useStorageActions = (refresh: (domain?: string) => void): StorageActions => {
  const text = useText();
  return useMemo(() => storageActions(refresh, text), [refresh, text]);
};

export { useStorageActions };
