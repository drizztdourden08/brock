/* @layer electron-main @kind logic */
import { dirname } from 'path';
import type { GrantGuards } from './grant-refusal.type';
import { pathInside } from './path-inside';
import { pathKey } from './path-key';

const grantRefusal = (real: string, guards: GrantGuards): string | null => {
  const inside = (outer: string, inner: string): boolean => pathInside(outer, inner, pathKey);
  if (dirname(real) === real) return 'A folder grant needs a folder below the filesystem root';
  if (guards.own.some((guard) => inside(guard, real))) return `"${real}" is, or sits inside, one of the app's own folders and cannot be granted`;
  if (guards.home.some((home) => inside(real, home))) return `"${real}" is, or holds, your home folder and cannot be granted`;
  if (guards.trees.some((tree) => inside(real, tree) || inside(tree, real))) {
    return `"${real}" is, holds, or sits inside AppData, Library, .config, .local, .cache, Program Files, Windows or ProgramData and cannot be granted`;
  }
  return null;
};

export { grantRefusal };
