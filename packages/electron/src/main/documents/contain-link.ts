/* @layer electron-main @kind logic */
import { basename, dirname, join } from 'path';
import { absolutePath } from './absolute-path';
import type { FolderGrants } from './folder-grants.type';
import { unsafeSegments } from './unsafe-segments';

const containLink = async (contain: FolderGrants['contain'], path: string): Promise<string | null> => {
  const full = absolutePath(path);
  if (unsafeSegments(path)) return null;
  const parent = await contain(dirname(full), true);
  if (parent === null) return null;
  return join(parent, basename(full));
};

export { containLink };
