/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { PaletteState } from './palette.type';

const usePaletteStore = create<PaletteState>()((set) => ({
  open: false,
  query: '',
  show: () => set({ open: true }),
  hide: () => set({ open: false, query: '' }),
  toggle: () => set((state) => (state.open ? { open: false, query: '' } : { open: true })),
  setQuery: (query) => set({ query }),
}));

export { usePaletteStore };
