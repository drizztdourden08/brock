/* @layer electron-main @kind logic */
import { lstat } from 'fs/promises';

const pathPresent = async (path: string): Promise<boolean> => {
  try {
    await lstat(path);
    return true;
  } catch {
    return false;
  }
};

export { pathPresent };
