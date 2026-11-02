/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { PaletteState } from './palette.type';
import { PALETTE_CLOSED } from './palette-store.constants';
import { startScope } from './pick-scope';

const usePaletteStore = create<PaletteState>()((set) => ({
  ...PALETTE_CLOSED,
  show: (options) => set((state) => ({ open: true, query: options?.query ?? state.query, scope: options?.scope ?? state.scope, picking: null, pickScope: null, asking: null })),
  hide: () => set(PALETTE_CLOSED),
  toggle: () => set((state) => (state.open ? PALETTE_CLOSED : { open: true })),
  pick: (picking) => set({ open: true, query: '', picking, pickScope: startScope(picking), asking: null }),
  setPickScope: (id) => set({ pickScope: id, asking: null }),
  setQuery: (query) => set({ query, asking: null }),
  ask: (id) => set({ asking: id }),
  settle: () => set({ asking: null }),
}));

export { usePaletteStore };
