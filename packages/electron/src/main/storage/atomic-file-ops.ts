/* @layer electron-main @kind logic */
import { mkdir, open, rename, rm } from 'fs/promises';
import type { AtomicFileOps } from './write-atomic.type';

const writeSynced = async (file: string, data: string | Uint8Array): Promise<void> => {
  const handle = await open(file, 'w');
  try {
    await handle.writeFile(data);
    await handle.sync();
  } finally {
    await handle.close();
  }
};

const atomicFileOps: AtomicFileOps = {
  mkdir: async (dir) => {
    await mkdir(dir, { recursive: true });
  },
  writeSynced,
  rename,
  remove: (file) => rm(file, { force: true }),
  pause: (ms) => new Promise((done) => setTimeout(done, ms)),
};

export { atomicFileOps };
