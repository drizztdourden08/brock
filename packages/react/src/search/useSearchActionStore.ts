/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { SearchActionState } from './search.type';

const useSearchActionStore = create<SearchActionState>()((set) => ({
  actions: [],
  add: (actions) => {
    const added = new Set(actions);
    set((state) => ({ actions: [...state.actions, ...actions] }));
    return () => set((state) => ({ actions: state.actions.filter((action) => !added.has(action)) }));
  },
}));

export { useSearchActionStore };
