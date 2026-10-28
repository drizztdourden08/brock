/* @layer electron-main @kind logic */
import { lstat } from 'fs/promises';
import type { CopiedFile } from './copied-file.type';
import { fileDigest } from './file-digest';

const unchangedSinceCopy = async (path: string, copied: CopiedFile | undefined): Promise<boolean> => {
  if (copied === undefined) return false;
  try {
    const now = await lstat(path);
    if (!now.isFile() || now.size !== copied.size || now.mtimeMs !== copied.mtimeMs) return false;
    return (await fileDigest(path)) === copied.digest;
  } catch {
    return false;
  }
};

export { unchangedSinceCopy };
