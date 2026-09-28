/* @layer electron-main @kind logic */
import { getUserDataPath } from '../paths/get-user-data-path';

const windowStatePath = (): string => getUserDataPath('config', 'window-state.json');

export { windowStatePath };
