/* @layer electron-main @kind logic */
import { shell } from 'electron';
import { getUserDataPath } from '../paths/get-user-data-path';

const revealLogs = async (): Promise<void> => {
  await shell.openPath(getUserDataPath('debug'));
};

export { revealLogs };
