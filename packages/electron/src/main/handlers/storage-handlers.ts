/* @layer electron-main @kind logic */
import { shell } from 'electron';
import type { DataLocation, StorageSummary } from '@drizztdourden08/brock-core/platform';
import { sanitizeId } from '@drizztdourden08/brock-core/storage';
import type { Result } from '@drizztdourden08/brock-core/result';
import type { HandlerGroup } from '../types/main-context.type';
import { getUserDataPath } from '../paths/get-user-data-path';
import { OS_LABEL } from './storage-handlers.constants';

const getLocation = (): DataLocation => ({
  path: getUserDataPath(),
  osLabel: OS_LABEL[process.platform] ?? process.platform,
  canReveal: true,
});

const storageHandlers: HandlerGroup = {
  id: 'storage',
  register: ({ handle, storage }) => {
    handle('storage:getLocation', () => getLocation());
    handle('storage:reveal', async () => { await shell.openPath(getUserDataPath()); });
    handle('storage:revealProfile', async (_e, profileId): Promise<Result> => {
      const error = await shell.openPath(getUserDataPath('profiles', sanitizeId(profileId)));
      return error ? { success: false, error } : { success: true };
    });
    handle('storage:getSummary', async (): Promise<StorageSummary> => {
      const domains = await Promise.all(storage.list().map((def) => storage.usage(def.domain)));
      const totalBytes = domains.reduce((sum, d) => sum + d.bytes, 0);
      return { location: getLocation(), domains, totalBytes };
    });
  },
};

export { storageHandlers };
