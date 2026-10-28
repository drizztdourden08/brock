/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { readWorkspaceViews } from './read-workspace-views';
import type { WorkspaceState } from './workspace.type';

const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  defs: [],
  active: null,
  base: null,
  views: {},
  ready: false,
  setDefs: (defs) => set((state) => (state.defs === defs ? state : { defs })),
  hydrate: (stored) => set({ views: readWorkspaceViews(stored), active: null, base: null, ready: true }),
  forget: () => set({ views: {}, active: null, base: null, ready: false }),
  put: (id, view) => set((state) => ({ views: { ...state.views, [id]: view } })),
}));

export { useWorkspaceStore };
