/* @layer electron-main @kind logic */
import { isAbsolute, resolve } from 'path';

const absolutePath = (path: unknown): string => {
  if (typeof path !== 'string' || path === '' || path.includes('\0') || !isAbsolute(path)) {
    throw new Error('A document path must be an absolute path');
  }
  return resolve(path);
};

export { absolutePath };
