/* @layer electron-main @kind logic */
import { app } from 'electron';
import { basename, isAbsolute, join, relative, resolve } from 'path';

const rendererRoot = (): string => {
  const appPath = app.getAppPath();
  return basename(appPath) === 'electron' ? resolve(appPath, '..', 'renderer') : join(appPath, 'dist', 'renderer');
};

const coreFilePath = (file: string): string => {
  const root = rendererRoot();
  const full = resolve(root, file);
  const back = relative(root, full);
  if (back.startsWith('..') || isAbsolute(back)) throw new Error(`Core file escapes the renderer folder: ${file}`);
  return full;
};

export { coreFilePath };
