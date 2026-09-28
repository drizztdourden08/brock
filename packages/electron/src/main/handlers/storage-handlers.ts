/* @layer electron-main @kind logic */
import { shell } from 'electron';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import type { DataDomainDef, DataLocation, DomainUsage, StorageSummary } from '@drizztdourden08/brock-core/platform';
import { sanitizeId } from '@drizztdourden08/brock-core/storage';
import type { HandlerGroup } from '../types/main-context.type';
import { getUserDataPath } from '../paths/get-user-data-path';
import { OS_LABEL } from './storage-handlers.constants';

const fileBytes = async (file: string): Promise<number> => {
  try { return (await stat(file)).size; } catch { return 0; }
};

const dirBytes = async (dir: string): Promise<number> => {
  let total = 0;
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return 0; }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    total += entry.isDirectory() ? await dirBytes(full) : await fileBytes(full);
  }
  return total;
};

const immediateCount = async (dir: string): Promise<number> => {
  try { return (await readdir(dir)).length; } catch { return 0; }
};

const getLocation = (): DataLocation => ({
  path: getUserDataPath(),
  osLabel: OS_LABEL[process.platform] ?? process.platform,
  canReveal: true,
});

const usageOf = async ({ domain, label, dir }: DataDomainDef): Promise<DomainUsage> => {
  const full = getUserDataPath(dir);
  return { domain, label, count: await immediateCount(full), bytes: await dirBytes(full) };
};

const storageHandlers = (dataDomains: DataDomainDef[]): HandlerGroup => ({
  id: 'storage',
  register: ({ handle }) => {
    handle('storage:getLocation', () => getLocation());
    handle('storage:reveal', async () => { await shell.openPath(getUserDataPath()); });
    handle('storage:revealProfile', async (_e, profileId) => {
      const error = await shell.openPath(getUserDataPath('profiles', sanitizeId(profileId)));
      return error ? { success: false, error } : { success: true };
    });
    handle('storage:getSummary', async (): Promise<StorageSummary> => {
      const domains: DomainUsage[] = [];
      for (const domain of dataDomains) domains.push(await usageOf(domain));
      const totalBytes = domains.reduce((sum, d) => sum + d.bytes, 0);
      return { location: getLocation(), domains, totalBytes };
    });
  },
});

export { storageHandlers };
