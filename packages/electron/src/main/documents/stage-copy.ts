/* @layer electron-main @kind logic */
import type { Stats } from 'fs';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { copyFileVerified } from './copy-file-verified';
import { LIST_LIMITS } from './list-limits.constants';
import { stagingSibling } from './staging-sibling';
import { treeEntries } from './tree-entries';
import type { StagedCopy } from './stage-copy.type';

const stageCopy = async (source: string, info: Stats, target: string): Promise<StagedCopy> => {
  const staging = stagingSibling(target);
  try {
    if (!info.isFile() && !info.isDirectory()) throw new Error(`"${source}" is not a plain file or folder`);
    if (info.isFile()) {
      await copyFileVerified(source, staging);
      return { staging, entries: [] };
    }
    const entries = await treeEntries(source, LIST_LIMITS.entries);
    await mkdir(staging);
    for (const entry of entries) {
      if (entry.folder) await mkdir(join(staging, entry.rel));
      else await copyFileVerified(join(source, entry.rel), join(staging, entry.rel));
    }
    return { staging, entries };
  } catch (error) {
    await rm(staging, { recursive: true, force: true });
    throw error;
  }
};

export { stageCopy };
