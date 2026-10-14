/* @layer electron-main @kind logic */
import { stat } from 'fs/promises';
import { shell } from 'electron';
import { resolveDataPath } from './resolve-data-path';

const trashDataPath = async (path: string): Promise<void> => {
  const full = resolveDataPath(path);
  try {
    await stat(full);
  } catch {
    return;
  }
  await shell.trashItem(full);
};

export { trashDataPath };
