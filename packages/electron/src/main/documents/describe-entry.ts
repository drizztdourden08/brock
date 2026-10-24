/* @layer electron-main @kind logic */
import type { Dirent } from 'fs';
import { realpath, stat } from 'fs/promises';
import { join } from 'path';
import type { DocumentEntry } from '@drizztdourden08/brock-core/platform';

const describeEntry = async (dir: string, dirent: Dirent, covers: (real: string) => boolean): Promise<DocumentEntry | null> => {
  const path = join(dir, dirent.name);
  const link = dirent.isSymbolicLink();
  try {
    const real = link ? await realpath(path) : path;
    if (link && !covers(real)) return null;
    const info = await stat(real);
    if (!info.isDirectory() && !info.isFile()) return null;
    return { path, name: dirent.name, kind: info.isDirectory() ? 'folder' : 'file', size: info.isFile() ? info.size : 0, modified: Math.round(info.mtimeMs), link };
  } catch {
    return null;
  }
};

export { describeEntry };
