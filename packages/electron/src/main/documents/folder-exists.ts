/* @layer electron-main @kind logic */
import { stat } from 'fs/promises';

const folderExists = async (path: string): Promise<boolean> => {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
};

export { folderExists };
