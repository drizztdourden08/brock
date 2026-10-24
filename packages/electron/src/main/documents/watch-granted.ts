/* @layer electron-main @kind logic */
import { stat } from 'fs/promises';
import type { DocumentWatchListener } from '@drizztdourden08/brock-core/platform';
import { absolutePath } from './absolute-path';
import { optionFlag } from './option-flag';
import { MAX_WATCHES } from './watch-limits.constants';
import { watchFolder } from './watch-folder';
import type { GrantedWatch } from './watch-granted.type';

const watchGranted = async ({ folders, registry, watcher, ms, max }: GrantedWatch, folder: string, options: unknown, listener: DocumentWatchListener): Promise<() => void> => {
  if (typeof listener !== 'function') throw new Error('A folder watch needs a listener');
  const dir = await folders.contain(folder);
  const root = dir === null ? null : folders.rootOf(dir);
  if (dir === null || root === null) throw new Error(`"${absolutePath(folder)}" is not inside a granted folder`);
  if (!(await stat(dir)).isDirectory()) throw new Error(`"${dir}" is not a folder`);
  if (registry.size() >= MAX_WATCHES) throw new Error('Too many folder watches are open');
  const stop = watchFolder({
    dir,
    recursive: optionFlag(options, 'recursive'),
    ms,
    max,
    watcher,
    check: async (path) => {
      const real = await folders.contain(path);
      return real !== null && folders.rootOf(real) === root;
    },
    live: () => folders.holds(root),
    listener,
  });
  return registry.add(root, stop);
};

export { watchGranted };
