/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import type { SessionStore } from './session-store.type';
import { sessionStores } from './session-stores';

const createSessionStore = <T extends object>(initializer: StateCreator<T>): SessionStore<T> => {
  const store = create<T>()(initializer);
  const initial = store.getInitialState();
  const reset = (): void => store.setState(initial, true);
  const tracked = Object.assign(store, { reset });
  sessionStores.add({ reset, filled: () => store.getState() !== initial });
  return tracked;
};

export { createSessionStore };
