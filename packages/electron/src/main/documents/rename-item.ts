/* @layer electron-main @kind logic */
import { rename, stat } from 'fs/promises';
import type { FolderGrants } from './folder-grants.type';
import { existingTarget } from './existing-target';
import { markOfTheWeb } from './mark-of-the-web';
import { newTarget } from './new-target';
import { optionFlag } from './option-flag';
import { pathInside } from './path-inside';
import { pathKey } from './path-key';
import { pathPresent } from './path-present';

const renameItem = async (folders: FolderGrants, from: string, to: string, options: unknown): Promise<void> => {
  const source = await existingTarget(folders, from);
  const target = await newTarget(folders, to);
  if (folders.rootOf(source) !== folders.rootOf(target)) throw new Error('A rename stays inside one granted folder');
  if (!(await pathPresent(source))) throw new Error(`"${source}" does not exist`);
  const same = pathKey(source) === pathKey(target);
  if (!same && pathInside(source, target, pathKey)) throw new Error(`"${source}" cannot be moved into itself`);
  if (!same && !optionFlag(options, 'overwrite') && (await pathPresent(target))) throw new Error(`"${target}" already exists`);
  await rename(source, target);
  if ((await stat(target)).isFile()) await markOfTheWeb(target);
};

export { renameItem };
