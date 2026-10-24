/* @layer electron-main @kind logic */
import type { FolderGrants } from './folder-grants.type';
import { pathIsLink } from './path-is-link';
import { plainReal } from './plain-real';
import { writeDenied } from './write-denied';

const existingTarget = async (folders: FolderGrants, path: string): Promise<string> => {
  const place = await folders.containLink(path);
  if (place !== null && (await pathIsLink(place))) return plainReal(folders, writeDenied(place) ? null : place, path);
  return plainReal(folders, await folders.contain(path, true), path);
};

export { existingTarget };
