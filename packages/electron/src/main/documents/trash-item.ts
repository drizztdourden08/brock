/* @layer electron-main @kind logic */
import type { FolderGrants } from './folder-grants.type';
import { existingTarget } from './existing-target';
import { pathPresent } from './path-present';

const trashItem = async (folders: FolderGrants, trash: (real: string) => Promise<void>, path: string): Promise<void> => {
  const real = await existingTarget(folders, path);
  if (!(await pathPresent(real))) throw new Error(`"${real}" does not exist`);
  await trash(real);
};

export { trashItem };
