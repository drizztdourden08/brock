/* @layer electron-main @kind logic */
import { absolutePath } from './absolute-path';
import type { FolderGrants } from './folder-grants.type';

const plainReal = (folders: FolderGrants, real: string | null, path: string): string => {
  if (real === null) throw new Error(`"${absolutePath(path)}" is not inside a granted folder, or may not be changed`);
  if (folders.holds(real)) throw new Error(`"${real}" is a granted folder itself`);
  if (folders.holdsProtected(real)) throw new Error(`"${real}" holds one of the app's own folders`);
  return real;
};

export { plainReal };
