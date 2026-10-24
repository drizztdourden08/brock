/* @layer electron-main @kind logic */
import { realpathSync } from 'fs';
import { resolve } from 'path';

const realOrResolved = (path: string): string => {
  try {
    return realpathSync.native(path);
  } catch {
    return resolve(path);
  }
};

const protectedReals = (roots: () => string[]): (() => string[]) => {
  let cached: string[] | null = null;
  return () => {
    cached ??= roots().filter((root) => root !== '').map(realOrResolved);
    return cached;
  };
};

export { protectedReals };
