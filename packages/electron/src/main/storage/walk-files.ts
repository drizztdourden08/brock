/* @layer electron-main @kind logic */
import { readdir, stat } from 'fs/promises';
import type { Dirent } from 'fs';
import { join, relative, sep } from 'path';
import { mapLimit } from './map-limit';
import { STAT_LANES } from './storage.constants';
import type { WalkedFile } from './storage.type';

const listFiles = async (root: string): Promise<Dirent[]> => {
  try {
    return (await readdir(root, { recursive: true, withFileTypes: true })).filter((entry) => entry.isFile());
  } catch {
    return [];
  }
};

const walkFiles = async (root: string): Promise<WalkedFile[]> => mapLimit(await listFiles(root), STAT_LANES, async (entry) => {
  const full = join(entry.parentPath, entry.name);
  const facts = await stat(full).catch(() => null);
  return { rel: relative(root, full).split(sep).join('/'), full, bytes: facts?.size ?? 0, mtimeMs: facts?.mtimeMs ?? 0 };
});

export { walkFiles };
