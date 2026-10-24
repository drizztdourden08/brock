/* @layer electron-main @kind logic */
import { realPathSyncOf } from './real-path-sync-of';
import type { ProtectedReals } from './protected-reals.type';

const protectedReals = (roots: () => string[]): ProtectedReals => {
  const known = new Map<string, { real: string; exists: boolean }>();
  let names: string[] | null = null;
  const refresh = (): void => {
    names ??= roots().filter((root) => root !== '');
    for (const name of names) {
      if (known.get(name)?.exists !== true) known.set(name, realPathSyncOf(name));
    }
  };
  const current = (): string[] => {
    if (names === null) refresh();
    return [...known.values()].map(({ real }) => real);
  };
  return { refresh, current };
};

export { protectedReals };
