/* @layer core @kind logic */
import type { Registry } from './registry.type';

const createRegistry = <T extends { id: string }>(initial: Iterable<T> = []): Registry<T> => {
  const items = new Map<string, T>();
  const listeners = new Set<(items: T[]) => void>();
  const list = (): T[] => [...items.values()];
  const notify = (): void => { for (const l of listeners) l(list()); };
  const register = (item: T): void => {
    if (items.has(item.id)) throw new Error(`Duplicate registration: "${item.id}"`);
    items.set(item.id, item);
    notify();
  };
  for (const item of initial) items.set(item.id, item);
  return {
    register,
    registerAll: (more) => { for (const item of more) register(item); },
    get: (id) => items.get(id),
    has: (id) => items.has(id),
    list,
    ids: () => [...items.keys()],
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export { createRegistry };
