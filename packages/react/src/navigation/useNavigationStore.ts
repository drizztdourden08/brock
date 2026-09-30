/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { NO_PARAMS } from './navigation.constants';
import type { NavigationState } from './navigation.type';
import { resolveRoute } from './resolve-route';
import { routeAliases } from './route-aliases';

const useNavigationStore = create<NavigationState>()((set) => ({
  active: null,
  params: NO_PARAMS,
  open: (id, params = NO_PARAMS) => set(resolveRoute(id, params, routeAliases.get)),
  close: () => set({ active: null, params: NO_PARAMS }),
}));

export { useNavigationStore };
