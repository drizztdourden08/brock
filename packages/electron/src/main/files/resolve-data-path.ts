/* @layer electron-main @kind logic */
import { join, normalize, relative, isAbsolute } from 'path';
import { getUserDataPath } from '../paths/get-user-data-path';

const resolveDataPath = (rel: string): string => {
  const root = getUserDataPath();
  const full = join(root, normalize(rel));
  const back = relative(root, full);
  if (back.startsWith('..') || isAbsolute(back)) throw new Error(`path escapes data root: ${rel}`);
  return full;
};

export { resolveDataPath };
