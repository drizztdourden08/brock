/* @layer electron-main @kind logic */
import { realpathSync, statSync } from 'fs';
import { absolutePath } from './absolute-path';
import { containLink } from './contain-link';
import { containNew } from './contain-new';
import { NETWORK_PATH } from './folder-grants.constants';
import { grantRefusal } from './grant-refusal';
import type { FolderGrantDeps, FolderGrants } from './folder-grants.type';
import { pathInside } from './path-inside';
import { pathKey } from './path-key';
import { protectedReals } from './protected-reals';
import { realPathOf } from './real-path-of';
import { rootNamed } from './root-named';
import { sensitiveFolders } from './sensitive-folders';
import { unsafeSegments } from './unsafe-segments';
import { writeDenied } from './write-denied';

const isNetwork = (path: string): boolean => process.platform === 'win32' && NETWORK_PATH.test(path);

const createFolderGrants = ({ protectedRoots = () => [], sensitiveRoots = sensitiveFolders, onRevoke }: FolderGrantDeps = {}): FolderGrants => {
  const roots = new Set<string>();
  const spellings = new Map<string, string>();
  const guarded = protectedReals(protectedRoots);
  const sensitiveHome = protectedReals(() => sensitiveRoots().home);
  const sensitiveTrees = protectedReals(() => sensitiveRoots().trees);

  const rootOf = (real: string): string | null => {
    if (guarded.current().some((guard) => pathInside(guard, real, pathKey))) return null;
    return [...roots].find((root) => pathInside(root, real)) ?? null;
  };

  const vet = (path: string): string => {
    const full = absolutePath(path);
    if (unsafeSegments(path)) throw new Error(`"${path}" is not a plain folder path`);
    const real = realpathSync.native(full);
    if (!statSync(real).isDirectory()) throw new Error(`"${real}" is not a folder`);
    for (const guard of [guarded, sensitiveHome, sensitiveTrees]) guard.refresh();
    const refusal = grantRefusal(real, { own: guarded.current(), home: sensitiveHome.current(), trees: sensitiveTrees.current() });
    if (refusal !== null) throw new Error(refusal);
    return real;
  };

  const adopt = (real: string, spelling = real): string => {
    roots.add(real);
    spellings.set(pathKey(spelling), real);
    return real;
  };

  const allow = (path: string): string => adopt(vet(path), absolutePath(path));

  const onNetworkRoot = (full: string): boolean => [...roots].some((root) => isNetwork(root) && pathInside(root, full, pathKey));

  const revoke = (path: string): boolean => {
    const full = absolutePath(path);
    if (unsafeSegments(path) || (isNetwork(full) && !onNetworkRoot(full))) return false;
    const root = rootNamed(roots, spellings, full);
    if (root === undefined) return false;
    spellings.forEach((value, spelling) => {
      if (value === root) spellings.delete(spelling);
    });
    const removed = roots.delete(root);
    if (removed) onRevoke?.(root);
    return removed;
  };

  const contain = async (path: string, write = false): Promise<string | null> => {
    const full = absolutePath(path);
    if (roots.size === 0 || unsafeSegments(path)) return null;
    if (isNetwork(full) && !onNetworkRoot(full)) return null;
    guarded.refresh();
    const real = await realPathOf(full);
    if (real === null || rootOf(real) === null) return null;
    return write && writeDenied(real) ? null : real;
  };

  const holdsProtected = (real: string): boolean => guarded.current().some((guard) => pathInside(real, guard, pathKey));

  return { allow, adopt, vet, revoke, contain, containNew: (path) => containNew(contain, path), containLink: (path) => containLink(contain, path), holdsProtected, covers: (real) => rootOf(real) !== null, rootOf, holds: (root) => roots.has(root) };
};

export { createFolderGrants };
