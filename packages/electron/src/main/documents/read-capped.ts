/* @layer electron-main @kind logic */
import type { Dirent } from 'fs';
import { opendir } from 'fs/promises';

const readCapped = async (dir: string, max: number): Promise<Dirent[]> => {
  const handle = await opendir(dir);
  const found: Dirent[] = [];
  for await (const dirent of handle) {
    found.push(dirent);
    if (found.length >= max) break;
  }
  return found;
};

export { readCapped };
