/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { PaletteState } from './palette.type';

const usePaletteStore = create<PaletteState>()((set) => ({
  open: false,
  query: '',
  asking: null,
  show: () => set({ open: true }),
  hide: () => set({ open: false, query: '', asking: null }),
  toggle: () => set((state) => (state.open ? { open: false, query: '', asking: null } : { open: true })),
  setQuery: (query) => set({ query, asking: null }),
  ask: (id) => set({ asking: id }),
  settle: () => set({ asking: null }),
}));

export { usePaletteStore };
