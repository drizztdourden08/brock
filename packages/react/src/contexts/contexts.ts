/* @layer renderer-shell @kind logic */
import { INACTIVE_CONTEXT } from './contexts.constants';
import type { AppContext } from './contexts.type';
import { useContextsStore } from './useContextsStore';

const contexts = {
  set: <T>(name: string, value: AppContext<T>): void => useContextsStore.getState().set(name, value),
  get: <T = unknown>(name: string): AppContext<T> => (useContextsStore.getState().contexts[name] ?? INACTIVE_CONTEXT) as AppContext<T>,
  isActive: (name: string): boolean => useContextsStore.getState().contexts[name]?.active === true,
  clear: (name: string): void => useContextsStore.getState().clear(name),
};

export { contexts };
