/* @layer electron-main @kind logic */
import { stat } from 'fs/promises';
import type { Stats } from 'fs';
import { isAbsolute } from 'path';

const statShownPath = async (path: string): Promise<Stats | string> => {
  if (typeof path !== 'string' || path.trim() === '' || !isAbsolute(path)) return `${String(path)} is not an absolute path`;
  return (await stat(path).catch(() => null)) ?? `${path} does not exist`;
};

export { statShownPath };
