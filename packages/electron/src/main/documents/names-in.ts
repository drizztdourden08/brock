/* @layer electron-main @kind logic */
import { readdir } from 'fs/promises';

const namesIn = async (dir: string): Promise<string[]> => {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
};

export { namesIn };
