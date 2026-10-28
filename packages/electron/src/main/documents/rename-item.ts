/* @layer electron-main @kind logic */
import type { Stats } from 'fs';
import { lstat, rename } from 'fs/promises';
import type { FolderGrants } from './folder-grants.type';
import { existingTarget } from './existing-target';
import { entryMoveGuard } from './entry-move-guard';
import { markOfTheWeb } from './mark-of-the-web';
import { moveByCopy } from './move-by-copy';
import { newTarget } from './new-target';
import { optionFlag } from './option-flag';
import { pathInside } from './path-inside';
import { pathKey } from './path-key';
import { pathPresent } from './path-present';

const moveOrCopy = async (source: string, info: Stats, target: string, overwrite: boolean): Promise<void> => {
  try {
    await rename(source, target);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EXDEV') throw error;
    await moveByCopy(source, info, target, overwrite);
  }
};

const renameItem = async (folders: FolderGrants, from: string, to: string, options: unknown): Promise<void> => {
  const source = await existingTarget(folders, from);
  const target = await newTarget(folders, to);
  const info = await lstat(source).catch(() => null);
  if (info === null) throw new Error(`"${source}" does not exist`);
  const same = pathKey(source) === pathKey(target);
  if (!same && pathInside(source, target, pathKey)) throw new Error(`"${source}" cannot be moved into itself`);
  if (!same && !optionFlag(options, 'overwrite') && (await pathPresent(target))) throw new Error(`"${target}" already exists`);
  await entryMoveGuard(info, source, target);
  await moveOrCopy(source, info, target, optionFlag(options, 'overwrite'));
  if ((await lstat(target)).isFile()) await markOfTheWeb(target);
};

export { renameItem };
