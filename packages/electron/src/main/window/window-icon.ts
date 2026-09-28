/* @layer electron-main @kind logic */
import { existsSync } from 'fs';
import { is } from '@electron-toolkit/utils';
import { appendMainLog } from '../logs/append-main-log';
import { findWindowIcon } from './find-window-icon';
import { logosDirs } from './logos-dirs';

const resolveWindowIcon = (rendererPath: string, instanceName: string | null): string | undefined => {
  const { path, warnings } = findWindowIcon({
    dirs: logosDirs(rendererPath, is.dev),
    platform: process.platform,
    instanceName,
    exists: existsSync,
  });
  for (const warning of warnings) appendMainLog('warn', warning);
  return path;
};

export { resolveWindowIcon };
