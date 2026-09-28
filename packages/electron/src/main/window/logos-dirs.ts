/* @layer electron-main @kind logic */
import { dirname, resolve } from 'path';
import { LOGOS_FOLDER } from './window-icon.constants';

const logosDirs = (rendererPath: string, isDev: boolean): string[] => {
  const rendererDir = dirname(rendererPath);
  const shipped = resolve(rendererDir, LOGOS_FOLDER);
  return isDev ? [resolve(rendererDir, '..', '..', 'public', LOGOS_FOLDER), shipped] : [shipped];
};

export { logosDirs };
