/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { NO_PARAMS } from './navigation.constants';
import type { NavigationState } from './navigation.type';

const useNavigationStore = create<NavigationState>()((set) => ({
  active: null,
  params: NO_PARAMS,
  open: (id, params = NO_PARAMS) => set({ active: id, params }),
  close: () => set({ active: null, params: NO_PARAMS }),
}));

export { useNavigationStore };
