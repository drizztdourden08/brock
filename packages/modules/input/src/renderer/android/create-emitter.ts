/* @layer renderer-shell @kind logic */
import type { Emitter } from './android-input.type';

const createEmitter = <A extends unknown[]>(onFirst?: () => void): Emitter<A> => {
  const listeners = new Set<(...args: A) => void>();
  return {
    on: (listener) => {
      listeners.add(listener);
      onFirst?.();
      return () => { listeners.delete(listener); };
    },
    emit: (...args) => {
      for (const listener of listeners) listener(...args);
    },
  };
};

export { createEmitter };
