/* @layer electron-main @kind logic */
import type { FolderGrants } from './folder-grants.type';
import { plainReal } from './plain-real';

const existingTarget = async (folders: FolderGrants, path: string): Promise<string> => plainReal(folders, await folders.contain(path, true), path);

export { existingTarget };
