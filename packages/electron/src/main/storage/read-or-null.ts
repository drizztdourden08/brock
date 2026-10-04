/* @layer electron-main @kind logic */
import { readFile } from 'fs/promises';

const readOrNull = async (full: string): Promise<Buffer | null> => {
  try {
    return await readFile(full);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
};

export { readOrNull };
