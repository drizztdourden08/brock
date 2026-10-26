/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { ContextMenuState } from './context-menu.type';

const useContextMenuStore = create<ContextMenuState>()((set) => ({
  menus: {},
  known: {},
  open: null,
  blocked: false,
  setMenu: (zone, config) => set((state) => ({ menus: { ...state.menus, [zone]: config }, known: { ...state.known, [zone]: config } })),
  clearMenu: (zone) => set((state) => ({ menus: Object.fromEntries(Object.entries(state.menus).filter(([name]) => name !== zone)) })),
  define: (zone, config) => set((state) => (zone in state.menus ? state : { known: { ...state.known, [zone]: config } })),
  show: (open) => set({ open }),
  hide: () => set({ open: null }),
  block: (blocked) => set(blocked ? { blocked, open: null } : { blocked }),
}));

export { useContextMenuStore };
