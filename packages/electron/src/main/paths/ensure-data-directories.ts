/* @layer electron-main @kind logic */
import { mkdir } from 'fs/promises';
import { getUserDataPath } from './get-user-data-path';

const ensureDataDirectories = async (dirs: readonly string[]): Promise<void> => {
  for (const dir of new Set(dirs)) {
    await mkdir(getUserDataPath(dir), { recursive: true });
  }
};

export { ensureDataDirectories };
