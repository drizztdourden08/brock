/* @layer electron-main @kind logic */
import { basename, dirname, join } from 'path';
import { absolutePath } from './absolute-path';
import type { FolderGrants } from './folder-grants.type';
import { unsafeSegments } from './unsafe-segments';
import { writeDenied } from './write-denied';

const containNew = async (contain: FolderGrants['contain'], path: string): Promise<string | null> => {
  const full = absolutePath(path);
  if (unsafeSegments(path)) return null;
  const parent = await contain(dirname(full), true);
  if (parent === null) return null;
  const target = join(parent, basename(full));
  if (writeDenied(target)) return null;
  return (await contain(target, true)) === null ? null : target;
};

export { containNew };
