/* @layer electron-main @kind logic */
import { mkdir, rename, rm } from 'fs/promises';
import type { AtomicFileOps } from './write-atomic.type';
import { syncedWriter } from './synced-writer';

const atomicFileOps: AtomicFileOps = {
  mkdir: async (dir) => {
    await mkdir(dir, { recursive: true });
  },
  writeSynced: syncedWriter(),
  rename,
  remove: (file) => rm(file, { force: true }),
  pause: (ms) => new Promise((done) => setTimeout(done, ms)),
};

export { atomicFileOps };
