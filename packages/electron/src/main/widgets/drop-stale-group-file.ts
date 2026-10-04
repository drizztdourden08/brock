/* @layer electron-main @kind logic */
import { rmSync } from 'fs';
import { appendMainLog } from '../logs/append-main-log';
import { getUserDataPath } from '../paths/get-user-data-path';
import { STALE_GROUP_FILE } from './widget-windows.constants';

const dropStaleGroupFile = (): void => {
  try {
    rmSync(getUserDataPath('config', STALE_GROUP_FILE), { force: true });
  } catch (err) {
    appendMainLog('warn', `[widgets] Could not remove the old window group file: ${String(err)}`);
  }
};

export { dropStaleGroupFile };
