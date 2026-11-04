/* @layer core @kind logic */
import type { MemoryView } from '../../memory/memory-view.type';
import type { CheckSignal } from './check-signal.type';

const listeners = new Set<(view: MemoryView | null) => void>();

const checkSignal: CheckSignal = {
  subscribe: (fn) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  notify: (view) => {
    for (const fn of [...listeners]) fn(view);
  },
};

export { checkSignal };
