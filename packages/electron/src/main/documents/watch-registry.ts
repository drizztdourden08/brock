/* @layer electron-main @kind logic */
import type { WatchRegistry } from './watch-registry.type';

const createWatchRegistry = (): WatchRegistry => {
  const active = new Map<symbol, { root: string; stop: () => void }>();

  const add = (root: string, stop: () => void): (() => void) => {
    const id = Symbol('watch');
    active.set(id, { root, stop });
    return () => {
      active.delete(id);
      stop();
    };
  };

  const stopRoot = (root: string): void => {
    for (const [id, watch] of [...active]) {
      if (watch.root !== root) continue;
      active.delete(id);
      watch.stop();
    }
  };

  return { add, stopRoot, size: () => active.size };
};

export { createWatchRegistry };
