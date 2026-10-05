/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { INITIAL_CONTEXTS } from './contexts.constants';
import type { ContextsState } from './contexts.type';
import { readContexts } from './read-contexts';

const useContextsStore = create<ContextsState>()((set) => ({
  contexts: INITIAL_CONTEXTS,
  set: (name, value) => set((state) => ({ contexts: { ...state.contexts, [name]: { ...value } } })),
  clear: (name) => set((state) => ({ contexts: Object.fromEntries(Object.entries(state.contexts).filter(([key]) => key !== name)) })),
  hydrate: (contexts) => set({ contexts: readContexts(contexts) }),
}));

export { useContextsStore };
