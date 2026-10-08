/* @layer electron-main @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { InstalledRecord } from '../catalog.type';
import { REGISTRY_PATH } from './catalog-main.constants';
import type { InstalledRegistry, RegistryFile } from './installed-registry.type';
import { parseRegistry } from './parse-registry';

const createInstalledRegistry = (files: FileStore): InstalledRegistry => {
  let queue: Promise<unknown> = Promise.resolve();
  const read = async (): Promise<InstalledRecord[]> => parseRegistry(await files.readText(REGISTRY_PATH)).records;

  const change = (edit: (records: InstalledRecord[]) => InstalledRecord[]): Promise<void> => {
    const run = queue.then(async () => {
      const next: RegistryFile = { version: 1, records: edit(await read()) };
      await files.writeText(REGISTRY_PATH, `${JSON.stringify(next, null, 2)}\n`);
    });
    queue = run.catch(() => undefined);
    return run;
  };

  return {
    list: read,
    get: async (itemId) => (await read()).find((record) => record.itemId === itemId) ?? null,
    put: (record) => change((records) => [...records.filter((entry) => entry.itemId !== record.itemId), record]),
    remove: (itemId) => change((records) => records.filter((entry) => entry.itemId !== itemId)),
  };
};

export { createInstalledRegistry };
