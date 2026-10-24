/* @layer electron-main @kind logic */
import { lstat, realpath } from 'fs/promises';
import { basename, dirname, join } from 'path';

const isMissing = (error: unknown): boolean => {
  const code = (error as NodeJS.ErrnoException).code;
  return code === 'ENOENT' || code === 'ENOTDIR';
};

const isLink = async (path: string): Promise<boolean> => {
  try {
    await lstat(path);
    return true;
  } catch {
    return false;
  }
};

const realPathOf = async (full: string): Promise<string | null> => {
  const tail: string[] = [];
  let current = full;
  for (;;) {
    try {
      const real = await realpath(current);
      return tail.length === 0 ? real : join(real, ...tail.reverse());
    } catch (error) {
      if (!isMissing(error) || (await isLink(current))) return null;
      const parent = dirname(current);
      if (parent === current) return null;
      tail.push(basename(current));
      current = parent;
    }
  }
};

export { realPathOf };
