/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { WorkspaceRegistryState } from './workspace.type';

const useWorkspaceRegistryStore = create<WorkspaceRegistryState>()((set) => ({
  registered: [],
  add: (defs) => {
    const added = new Set(defs);
    set((state) => ({ registered: [...state.registered, ...defs] }));
    return () => set((state) => ({ registered: state.registered.filter((def) => !added.has(def)) }));
  },
}));

export { useWorkspaceRegistryStore };
