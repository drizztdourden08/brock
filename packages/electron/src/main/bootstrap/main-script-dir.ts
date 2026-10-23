/* @layer electron-main @kind logic */
import { app } from 'electron';
import { basename, dirname, join } from 'path';

const mainScriptDir = (): string => {
  const appPath = app.getAppPath();
  const isScriptDir = basename(appPath) === 'electron' && basename(dirname(appPath)) === 'dist';
  return isScriptDir ? appPath : join(appPath, 'dist', 'electron');
};

export { mainScriptDir };
