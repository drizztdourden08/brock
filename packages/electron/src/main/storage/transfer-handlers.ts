/* @layer electron-main @kind logic */
import { randomUUID } from 'crypto';
import { app } from 'electron';
import type { DataImportPlan } from '@drizztdourden08/brock-core/platform';
import { DATA_EXPORT_JOB, DATA_IMPORT_JOB } from '@drizztdourden08/brock-core/storage';
import type { HandlerGroup } from '../types/main-context.type';
import { exportDomains } from './export-domains';
import { importDomains } from './import-domains';
import { pickTransferPath } from './pick-transfer-path';
import { readImportSource } from './read-import-source';
import { stepReporter } from './step-reporter';
import type { ImportSource } from './transfer.type';

const planOf = (token: string, from: ImportSource, known: ReadonlySet<string>): DataImportPlan => ({
  token,
  source: from.source,
  app: from.manifest.app,
  exportedAt: from.manifest.exportedAt,
  domains: from.manifest.domains.map((entry) => ({ ...entry, known: known.has(entry.domain) })),
});

const transferHandlers: HandlerGroup = {
  id: 'data-transfer',
  register: ({ handle, storage, product, window, job }) => {
    const pending = new Map<string, ImportSource>();
    const stepsOf = (ids: readonly string[]) => ids.map((id) => ({ id, label: storage.def(id).label }));

    handle('storage:exportDomains', async (_e, ids, format) => {
      for (const id of ids) storage.def(id);
      const target = await pickTransferPath(window(), product.id, format, 'export');
      if (target === null) return null;
      return job(DATA_EXPORT_JOB, stepsOf(ids), { title: 'Exporting data' }).run((running) => exportDomains({
        domains: storage, ids, format, target, app: { app: product.id, appVersion: app.getVersion() }, signal: running.signal, report: stepReporter(running, storage),
      }));
    });

    handle('storage:pickImport', async (_e, format) => {
      const source = await pickTransferPath(window(), product.id, format, 'import');
      if (source === null) return null;
      const from = await readImportSource(source, format);
      const token = randomUUID();
      pending.set(token, from);
      return planOf(token, from, new Set(storage.list().map((def) => def.domain)));
    });

    handle('storage:applyImport', async (_e, token, ids) => {
      const from = pending.get(token);
      if (!from) throw new Error('this import is no longer pending; pick the export again');
      pending.delete(token);
      const chosen = ids.filter((id) => storage.list().some((def) => def.domain === id));
      return job(DATA_IMPORT_JOB, stepsOf(chosen), { title: 'Importing data' }).run((running) => importDomains({
        domains: storage, from, ids: chosen, signal: running.signal, report: stepReporter(running, storage),
      }));
    });
  },
};

export { transferHandlers };
