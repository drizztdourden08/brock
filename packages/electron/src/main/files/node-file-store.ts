/* @layer electron-main @kind logic */
import { readFile, writeFile, readdir, rm, mkdir, stat } from 'fs/promises';
import { dirname } from 'path';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { resolveDataPath } from './resolve-data-path';

const ensureParent = (full: string): Promise<void> => mkdir(dirname(full), { recursive: true }).then(() => undefined);

const createNodeFileStore = (): FileStore => ({
  readBytes: async (path) => {
    try { return new Uint8Array(await readFile(resolveDataPath(path))); } catch { return null; }
  },
  readText: async (path) => {
    try { return await readFile(resolveDataPath(path), 'utf8'); } catch { return null; }
  },
  writeBytes: async (path, data) => {
    const full = resolveDataPath(path);
    await ensureParent(full);
    await writeFile(full, data);
  },
  writeText: async (path, data) => {
    const full = resolveDataPath(path);
    await ensureParent(full);
    await writeFile(full, data, 'utf8');
  },
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
});

export { createNodeFileStore };
