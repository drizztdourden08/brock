/* @layer electron-main @kind logic */
import type { FolderGrants } from './folder-grants.type';
import { plainReal } from './plain-real';

const newTarget = async (folders: FolderGrants, path: string): Promise<string> => plainReal(folders, await folders.containNew(path), path);

export { newTarget };
