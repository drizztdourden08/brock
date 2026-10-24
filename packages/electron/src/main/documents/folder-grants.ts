/* @layer electron-main @kind logic */
import { realpathSync, statSync } from 'fs';
import { dirname } from 'path';
import { absolutePath } from './absolute-path';
import { NETWORK_PATH } from './folder-grants.constants';
import type { FolderGrantDeps, FolderGrants } from './folder-grants.type';
import { pathInside } from './path-inside';
import { pathKey } from './path-key';
import { protectedReals } from './protected-reals';
import { realPathOf } from './real-path-of';
import { unsafeSegments } from './unsafe-segments';

const isNetwork = (path: string): boolean => process.platform === 'win32' && NETWORK_PATH.test(path);

const createFolderGrants = ({ protectedRoots = () => [] }: FolderGrantDeps = {}): FolderGrants => {
  const roots = new Set<string>();
  const spellings = new Map<string, string>();
  const guarded = protectedReals(protectedRoots);

  const rootOf = (real: string): string | null => {
    if (guarded().some((guard) => pathInside(guard, real, pathKey))) return null;
    return [...roots].find((root) => pathInside(root, real)) ?? null;
  };

  const allow = (path: string): string => {
    const full = absolutePath(path);
    if (unsafeSegments(path)) throw new Error(`"${path}" is not a plain folder path`);
    const real = realpathSync.native(full);
    if (!statSync(real).isDirectory()) throw new Error(`"${real}" is not a folder`);
    if (dirname(real) === real) throw new Error('A folder grant needs a folder below the filesystem root');
    if (guarded().some((guard) => pathInside(guard, real, pathKey) || pathInside(real, guard, pathKey))) {
      throw new Error(`"${real}" holds or sits inside the app's own folders and cannot be granted`);
    }
    roots.add(real);
    spellings.set(pathKey(full), real);
    return real;
  };

  const revoke = (path: string): boolean => {
    const full = absolutePath(path);
    let real: string | undefined;
    try {
      real = realpathSync.native(full);
    } catch {
      real = undefined;
    }
    const root = real !== undefined && roots.has(real) ? real : spellings.get(pathKey(full));
    if (root === undefined) return false;
    spellings.forEach((value, spelling) => {
      if (value === root) spellings.delete(spelling);
    });
    return roots.delete(root);
  };

  const onNetworkRoot = (full: string): boolean => [...roots].some((root) => isNetwork(root) && pathInside(root, full, pathKey));

  const contain = async (path: string): Promise<string | null> => {
    const full = absolutePath(path);
    if (roots.size === 0 || unsafeSegments(path)) return null;
    if (isNetwork(full) && !onNetworkRoot(full)) return null;
    const real = await realPathOf(full);
    return real !== null && rootOf(real) !== null ? real : null;
  };

  return { allow, revoke, contain, covers: (real) => rootOf(real) !== null, rootOf, holds: (root) => roots.has(root) };
};

export { createFolderGrants };
