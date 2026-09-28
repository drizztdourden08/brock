/* @layer electron-main @kind logic */
import { getUserDataPath } from '../paths/get-user-data-path';

const currentLogPath = (): string => getUserDataPath('debug', 'session.log');

export { currentLogPath };
