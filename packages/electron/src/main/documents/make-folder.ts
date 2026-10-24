/* @layer electron-main @kind logic */
import { mkdir } from 'fs/promises';
import type { FolderGrants } from './folder-grants.type';
import { newTarget } from './new-target';
import { optionFlag } from './option-flag';

const makeFolder = async (folders: FolderGrants, path: string, options: unknown): Promise<void> => {
  const target = await newTarget(folders, path);
  await mkdir(target, { recursive: optionFlag(options, 'recursive') });
};

export { makeFolder };
