/* @layer electron-main @kind logic */
import { lstat, readdir } from 'fs/promises';
import { join } from 'path';

const measurePath = async (path: string): Promise<number> => {
  const stats = await lstat(path).catch(() => null);
  if (!stats) return 0;
  if (!stats.isDirectory()) return stats.isFile() ? stats.size : 0;
  const names = await readdir(path).catch(() => []);
  const sizes = await Promise.all(names.map((name) => measurePath(join(path, name))));
  return sizes.reduce((total, size) => total + size, 0);
};

export { measurePath };
