/* @layer electron-main @kind logic */
import type { Stats } from 'fs';
import { rename, rm } from 'fs/promises';
import { join } from 'path';
import { markOfTheWeb } from './mark-of-the-web';
import { pathPresent } from './path-present';
import type { StagedCopy } from './stage-copy.type';

const commitCopy = async (staged: StagedCopy, info: Stats, target: string, overwrite: boolean): Promise<void> => {
  try {
    if ((await pathPresent(target)) && (!overwrite || info.isDirectory())) throw new Error(`"${target}" already exists`);
    await rename(staged.staging, target);
  } catch (error) {
    await rm(staged.staging, { recursive: true, force: true });
    throw error;
  }
  if (info.isFile()) await markOfTheWeb(target);
  else for (const entry of staged.entries) if (!entry.folder) await markOfTheWeb(join(target, entry.rel));
};

export { commitCopy };
