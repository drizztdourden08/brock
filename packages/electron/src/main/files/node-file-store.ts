/* @layer electron-main @kind logic */
import { readFile, readdir, rm, mkdir, stat } from 'fs/promises';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { NodeFileStoreOptions } from './node-file-store.type';
import { resolveDataPath } from './resolve-data-path';
import { trashDataPath } from './trash-data-path';
import { writeAtomic } from '../storage/write-atomic';

const createNodeFileStore = (options: NodeFileStoreOptions = {}): FileStore => ({
  readBytes: async (path) => {
    try { return new Uint8Array(await readFile(resolveDataPath(path))); } catch { return null; }
  },
  readText: async (path) => {
    try { return await readFile(resolveDataPath(path), 'utf8'); } catch { return null; }
  },
  writeBytes: (path, data) => writeAtomic(resolveDataPath(path), data),
  writeText: (path, data) => writeAtomic(resolveDataPath(path), data),
  list: async (dir) => {
    try { return await readdir(resolveDataPath(dir)); } catch { return []; }
  },
  remove: async (path) => {
    await rm(resolveDataPath(path), { recursive: true, force: true });
  },
  exists: async (path) => {
    try { await stat(resolveDataPath(path)); return true; } catch { return false; }
  },
  mkdir: async (dir) => {
    await mkdir(resolveDataPath(dir), { recursive: true });
  },
  stat: async (path) => {
    try {
      const s = await stat(resolveDataPath(path));
      return { bytes: s.size, isDirectory: s.isDirectory(), mtimeMs: s.mtimeMs };
    } catch { return null; }
  },
  ...(options.trashItem ? { trash: trashDataPath(options.trashItem) } : {}),
});

export { createNodeFileStore };
