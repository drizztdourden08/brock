/* @layer electron-main @kind logic */
import type { Stats } from 'fs';
import { rmdir, unlink } from 'fs/promises';
import { join } from 'path';
import type { StagedCopy } from './stage-copy.type';
import { unchangedSinceCopy } from './unchanged-since-copy';

const removeFile = async (path: string, staged: StagedCopy, rel: string, kept: string[]): Promise<void> => {
  if (await unchangedSinceCopy(path, staged.files.get(rel))) await unlink(path);
  else kept.push(path);
};

const removeFolder = async (path: string, kept: string[]): Promise<void> => {
  try {
    await rmdir(path);
  } catch {
    kept.push(path);
  }
};

const removeCopied = async (source: string, info: Stats, staged: StagedCopy): Promise<string[]> => {
  const kept: string[] = [];
  if (info.isFile()) {
    await removeFile(source, staged, '', kept);
    return kept;
  }
  const deepestFirst = [...staged.entries].reverse();
  for (const entry of deepestFirst) if (!entry.folder) await removeFile(join(source, entry.rel), staged, entry.rel, kept);
  for (const entry of deepestFirst) if (entry.folder) await removeFolder(join(source, entry.rel), kept);
  await removeFolder(source, kept);
  return kept;
};

export { removeCopied };
