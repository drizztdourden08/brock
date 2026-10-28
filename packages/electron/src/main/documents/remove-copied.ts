/* @layer electron-main @kind logic */
import type { Stats } from 'fs';
import { rmdir, unlink } from 'fs/promises';
import { join } from 'path';
import type { TreeEntry } from './tree-entries.type';

const removeCopied = async (source: string, info: Stats, entries: TreeEntry[]): Promise<void> => {
  if (info.isFile()) {
    await unlink(source);
    return;
  }
  const deepestFirst = [...entries].reverse();
  for (const entry of deepestFirst) if (!entry.folder) await unlink(join(source, entry.rel));
  for (const entry of deepestFirst) if (entry.folder) await rmdir(join(source, entry.rel));
  await rmdir(source);
};

export { removeCopied };
