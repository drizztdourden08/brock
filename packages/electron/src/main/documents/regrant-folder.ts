/* @layer electron-main @kind logic */
import { absolutePath } from './absolute-path';
import type { FolderGrants } from './folder-grants.type';
import { pathKey } from './path-key';
import type { RememberedFolders } from './remembered-folders.type';
import { unsafeSegments } from './unsafe-segments';

const regrantFolder = async (folders: FolderGrants, memory: RememberedFolders, profileId: string, path: string): Promise<string> => {
  const full = absolutePath(path);
  if (unsafeSegments(path)) throw new Error(`"${path}" is not a plain folder path`);
  const stored = await memory.find(profileId, full);
  if (stored === null) throw new Error(`"${full}" is not a remembered folder`);
  const real = folders.vet(stored);
  if (pathKey(real) !== pathKey(stored)) throw new Error(`"${stored}" now leads somewhere else and is not granted again`);
  return folders.allow(stored);
};

export { regrantFolder };
