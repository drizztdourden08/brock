/* @layer electron-main @kind logic */
import { stat } from 'fs/promises';
import { resolveDataPath } from './resolve-data-path';

const trashDataPath = (trashItem: (fullPath: string) => Promise<void>) => async (path: string): Promise<void> => {
  const full = resolveDataPath(path);
  try {
    await stat(full);
  } catch {
    return;
  }
  await trashItem(full);
};

export { trashDataPath };
