/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { PaletteState } from './palette.type';
import { PALETTE_CLOSED } from './palette-store.constants';

const usePaletteStore = create<PaletteState>()((set) => ({
  ...PALETTE_CLOSED,
  show: (options) => set((state) => ({ open: true, query: options?.query ?? state.query, scope: options?.scope ?? state.scope, picking: null, asking: null })),
  hide: () => set(PALETTE_CLOSED),
  toggle: () => set((state) => (state.open ? PALETTE_CLOSED : { open: true })),
  pick: (picking) => set({ open: true, query: '', picking, asking: null }),
  setQuery: (query) => set({ query, asking: null }),
  ask: (id) => set({ asking: id }),
  settle: () => set({ asking: null }),
}));

export { usePaletteStore };
