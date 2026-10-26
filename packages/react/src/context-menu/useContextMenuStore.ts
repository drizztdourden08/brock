/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { ContextMenuState } from './context-menu.type';

const useContextMenuStore = create<ContextMenuState>()((set) => ({
  menus: {},
  open: null,
  blocked: false,
  setMenu: (zone, config) => set((state) => ({ menus: { ...state.menus, [zone]: config } })),
  clearMenu: (zone) => set((state) => ({ menus: Object.fromEntries(Object.entries(state.menus).filter(([name]) => name !== zone)) })),
  show: (open) => set({ open }),
  hide: () => set({ open: null }),
  block: (blocked) => set(blocked ? { blocked, open: null } : { blocked }),
}));

export { useContextMenuStore };
