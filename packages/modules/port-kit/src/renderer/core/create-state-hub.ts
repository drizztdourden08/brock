/* @layer renderer-shell @kind logic */
import type { CoreListener, CoreState, StateHub } from './game-core.type';
import { IDLE_STATE } from './game-core.constants';

const createStateHub = (): StateHub => {
  let current: CoreState = IDLE_STATE;
  const listeners = new Set<CoreListener>();

  const set = (next: CoreState): void => {
    current = next;
    for (const listener of listeners) listener(next);
  };

  const subscribe = (listener: CoreListener): (() => void) => {
    listeners.add(listener);
    queueMicrotask(() => {
      if (listeners.has(listener)) listener(current);
    });
    return () => {
      listeners.delete(listener);
    };
  };

  return { get: () => current, set, subscribe };
};

export { createStateHub };
