/* @layer electron-main @kind logic */
import { stat } from 'fs/promises';

const pathExists = async (path: string): Promise<boolean> => {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
};

export { pathExists };
