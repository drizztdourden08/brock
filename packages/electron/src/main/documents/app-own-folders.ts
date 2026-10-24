/* @layer electron-main @kind logic */
import { dirname } from 'path';
import { app } from 'electron';
import type { MainContext } from '../types/main-context.type';

const appOwnFolders = (paths: MainContext['paths']): string[] => [
  paths.userData(),
  paths.data(),
  dirname(process.execPath),
  process.resourcesPath,
  app.getAppPath(),
].filter((folder): folder is string => typeof folder === 'string');

export { appOwnFolders };
