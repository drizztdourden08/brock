/* @layer electron-main @kind logic */
import { opendir } from 'fs/promises';
import { join } from 'path';
import type { TreeEntry } from './tree-entries.type';

const treeEntries = async (root: string, max: number): Promise<TreeEntry[]> => {
  const found: TreeEntry[] = [];
  const pending = [''];
  for (let rel = pending.shift(); rel !== undefined; rel = pending.shift()) {
    for await (const dirent of await opendir(join(root, rel))) {
      const child = join(rel, dirent.name);
      if (dirent.isSymbolicLink()) throw new Error(`"${join(root, child)}" is a link, and a copy never follows or carries a link`);
      if (!dirent.isFile() && !dirent.isDirectory()) throw new Error(`"${join(root, child)}" is not a plain file or folder`);
      found.push({ rel: child, folder: dirent.isDirectory() });
      if (found.length > max) throw new Error(`"${root}" holds more than ${max} entries and cannot be copied in one step`);
      if (dirent.isDirectory()) pending.push(child);
    }
  }
  return found;
};

export { treeEntries };
