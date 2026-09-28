/* @layer electron-main @kind logic */
import { getUserDataPath } from '../paths/get-user-data-path';

const mainLogPath = (): string => getUserDataPath('debug', 'main-console.log');

export { mainLogPath };
