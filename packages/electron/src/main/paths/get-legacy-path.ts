/* @layer electron-main @kind logic */
import { join } from 'path';
import { userDataRoot } from './user-data-root';

const getLegacyPath = (...segments: string[]): string => join(userDataRoot.path, ...segments);

export { getLegacyPath };
