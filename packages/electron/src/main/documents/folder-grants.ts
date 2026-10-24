/* @layer electron-main @kind logic */
import { realpathSync, statSync } from 'fs';
import { dirname } from 'path';
import { absolutePath } from './absolute-path';
import type { FolderGrants } from './folder-grants.type';
import { pathInside } from './path-inside';
import { pathKey } from './path-key';
import { realPathOf } from './real-path-of';
import { unsafeSegments } from './unsafe-segments';

const createFolderGrants = (): FolderGrants => {
  const roots = new Map<string, string>();
  const spellings = new Map<string, string>();

  const covers = (real: string): boolean => [...roots.values()].some((root) => pathInside(root, real));

  const allow = (path: string): string => {
    const full = absolutePath(path);
    if (unsafeSegments(path)) throw new Error(`"${path}" is not a plain folder path`);
    const real = realpathSync.native(full);
    if (!statSync(real).isDirectory()) throw new Error(`"${real}" is not a folder`);
    if (dirname(real) === real) throw new Error('A folder grant needs a folder below the filesystem root');
    roots.set(pathKey(real), real);
    spellings.set(pathKey(full), pathKey(real));
    return real;
  };

  const revoke = (path: string): boolean => {
    const key = pathKey(absolutePath(path));
    const rootKey = spellings.get(key) ?? key;
    spellings.forEach((value, spelling) => {
      if (value === rootKey) spellings.delete(spelling);
    });
    return roots.delete(rootKey);
  };

  const contain = async (path: string): Promise<string | null> => {
    const full = absolutePath(path);
    if (roots.size === 0 || unsafeSegments(path)) return null;
    const real = await realPathOf(full);
    return real !== null && covers(real) ? real : null;
  };

  return { allow, revoke, contain, covers };
};

export { createFolderGrants };
