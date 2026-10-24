/* @layer electron-main @kind logic */
import { opendir } from 'fs/promises';
import { join } from 'path';
import { writeDenied } from './write-denied';

const subtreeDenied = async (source: string, target: string, max: number): Promise<boolean> => {
  const pending = [''];
  let seen = 0;
  for (let rel = pending.pop(); rel !== undefined; rel = pending.pop()) {
    for await (const dirent of await opendir(join(source, rel))) {
      seen += 1;
      if (seen > max) throw new Error(`"${source}" holds more than ${max} entries and cannot be checked before it is moved`);
      const child = join(rel, dirent.name);
      if (writeDenied(join(target, child))) return true;
      if (dirent.isDirectory()) pending.push(child);
    }
  }
  return false;
};

export { subtreeDenied };
