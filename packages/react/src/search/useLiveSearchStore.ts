/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { LiveSearchState } from './search.type';

const useLiveSearchStore = create<LiveSearchState>()((set) => ({
  entries: [],
  add: (entries) => {
    const added = new Set(entries);
    set((state) => ({ entries: [...state.entries, ...entries] }));
    return () => set((state) => ({ entries: state.entries.filter((entry) => !added.has(entry)) }));
  },
}));

export { useLiveSearchStore };
