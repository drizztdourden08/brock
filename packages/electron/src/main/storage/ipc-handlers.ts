/* @layer electron-main @kind logic */
import { mkdir } from 'fs/promises';
import { shell } from 'electron';
import type { Result } from '@drizztdourden08/brock-core/result';
import type { HandlerGroup } from '../types/main-context.type';
import { toArrayBuffer } from '../files/to-array-buffer';
import { cleanDir } from './clean-dir';
import { DAY_MS } from './storage.constants';

const dataDomainHandlers: HandlerGroup = {
  id: 'data-domains',
  register: ({ handle, storage }) => {
    const dirOf = (domain: string): string => storage.domain(domain).dir();
    handle('storage:listDomains', () => storage.list());
    handle('storage:getDomainUsage', (_e, domain) => storage.usage(domain));
    handle('storage:revealDomain', async (_e, domain): Promise<Result> => {
      await mkdir(dirOf(domain), { recursive: true });
      const error = await shell.openPath(dirOf(domain));
      return error ? { success: false, error } : { success: true };
    });
    handle('storage:clearDomain', async (_e, domain) => {
      if (storage.def(domain).clearable === false) throw new Error(`data domain "${domain}" cannot be cleared`);
      return { domain, ...(await cleanDir(dirOf(domain), null)) };
    });
    handle('storage:cleanDomain', async (_e, domain, olderThanDays) => {
      if (!(olderThanDays > 0)) throw new Error('clean needs at least one day');
      return { domain, ...(await cleanDir(dirOf(domain), olderThanDays * DAY_MS)) };
    });
    handle('domain:readJson', (_e, domain, path) => storage.domain(domain).readJson<unknown>(path, null));
    handle('domain:writeJson', (_e, domain, path, value) => storage.domain(domain).writeJson(path, value));
    handle('domain:readBytes', async (_e, domain, path) => {
      const bytes = await storage.domain(domain).readBytes(path);
      return bytes ? toArrayBuffer(Buffer.from(bytes)) : null;
    });
    handle('domain:writeBytes', (_e, domain, path, data) => storage.domain(domain).writeBytes(path, new Uint8Array(data)));
    handle('domain:list', (_e, domain, dir) => storage.domain(domain).list(dir));
    handle('domain:remove', (_e, domain, path) => storage.domain(domain).remove(path));
    handle('domain:size', (_e, domain, path) => storage.domain(domain).size(path));
  },
};

export { dataDomainHandlers };
