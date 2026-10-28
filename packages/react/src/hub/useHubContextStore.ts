/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { HubContextState } from './hub.type';

const useHubContextStore = create<HubContextState>()((set) => ({
  byHub: {},
  put: (id, context) => set((state) => ({ byHub: { ...state.byHub, [id]: context } })),
  drop: (id) => set((state) => ({ byHub: Object.fromEntries(Object.entries(state.byHub).filter(([key]) => key !== id)) })),
}));

export { useHubContextStore };
