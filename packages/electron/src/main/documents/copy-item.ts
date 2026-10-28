/* @layer electron-main @kind logic */
import { lstat } from 'fs/promises';
import { absolutePath } from './absolute-path';
import { commitCopy } from './commit-copy';
import { entryMoveGuard } from './entry-move-guard';
import type { FolderGrants } from './folder-grants.type';
import { newTarget } from './new-target';
import { optionFlag } from './option-flag';
import { pathInside } from './path-inside';
import { pathKey } from './path-key';
import { pathPresent } from './path-present';
import { stageCopy } from './stage-copy';

const copyItem = async (folders: FolderGrants, resolveSource: (path: string) => Promise<string>, from: string, to: string, options: unknown): Promise<void> => {
  const source = await resolveSource(from);
  if (folders.holdsProtected(source)) throw new Error(`"${source}" holds one of the app's own folders and may not be copied`);
  const info = await lstat(source).catch(() => null);
  if (info === null) throw new Error(`"${source}" does not exist`);
  if (info.isSymbolicLink()) throw new Error(`"${source}" is a link, and a copy never follows or carries a link`);
  const target = await newTarget(folders, to);
  if (pathKey(source) === pathKey(target)) throw new Error(`"${absolutePath(source)}" cannot be copied onto itself`);
  if (pathInside(source, target, pathKey)) throw new Error(`"${source}" cannot be copied into itself`);
  const overwrite = optionFlag(options, 'overwrite');
  if (!overwrite && (await pathPresent(target))) throw new Error(`"${target}" already exists`);
  await entryMoveGuard(info, source, target);
  const staged = await stageCopy(source, info, target);
  await commitCopy(staged, info, target, overwrite);
};

export { copyItem };
