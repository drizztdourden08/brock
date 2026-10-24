/* @layer electron-main @kind logic */
import { lstat } from 'fs/promises';

const pathIsLink = async (path: string): Promise<boolean> => {
  try {
    return (await lstat(path)).isSymbolicLink();
  } catch {
    return false;
  }
};

export { pathIsLink };
