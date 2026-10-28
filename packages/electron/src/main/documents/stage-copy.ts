/* @layer electron-main @kind logic */
import type { Stats } from 'fs';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { copyFileVerified } from './copy-file-verified';
import { LIST_LIMITS } from './list-limits.constants';
import { tempSibling } from './temp-sibling';
import { treeEntries } from './tree-entries';
import type { StagedCopy } from './stage-copy.type';

const stageCopy = async (source: string, info: Stats, target: string): Promise<StagedCopy> => {
  const temp = tempSibling(target);
  try {
    if (!info.isFile() && !info.isDirectory()) throw new Error(`"${source}" is not a plain file or folder`);
    if (info.isFile()) {
      await copyFileVerified(source, temp);
      return { temp, entries: [] };
    }
    const entries = await treeEntries(source, LIST_LIMITS.entries);
    await mkdir(temp);
    for (const entry of entries) {
      if (entry.folder) await mkdir(join(temp, entry.rel));
      else await copyFileVerified(join(source, entry.rel), join(temp, entry.rel));
    }
    return { temp, entries };
  } catch (error) {
    await rm(temp, { recursive: true, force: true });
    throw error;
  }
};

export { stageCopy };
