/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { MenuHiddenState } from './menu-config.type';

const useMenuHiddenStore = create<MenuHiddenState>()((set) => ({
  routes: new Set(),
  setRoutes: (routes) => set((state) => (sameRoutes(state.routes, routes) ? state : { routes })),
}));

const sameRoutes = (a: ReadonlySet<string>, b: ReadonlySet<string>): boolean => a.size === b.size && [...a].every((route) => b.has(route));

export { useMenuHiddenStore };
