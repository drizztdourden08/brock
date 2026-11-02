/* @layer electron-main @kind logic */
import { join } from 'path';
import { dataRootOf } from './data-root-of';
import { userDataRoot } from './user-data-root';

const getUserDataPath = (...segments: string[]): string => join(dataRootOf(userDataRoot.path), ...segments);

export { getUserDataPath };
