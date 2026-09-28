/* @layer electron-main @kind logic */
import { join } from 'path';
import { userDataRoot } from './user-data-root';

const getUserDataPath = (...segments: string[]): string => join(userDataRoot.path, 'Data', ...segments);

export { getUserDataPath };
