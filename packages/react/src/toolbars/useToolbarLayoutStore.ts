/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { createToolbarLayout, migrateToolbarLayout, toggleToolbar } from '@drizztdourden08/tessera/composites';
import type { ToolbarLayoutState } from './toolbar.type';

const useToolbarLayoutStore = create<ToolbarLayoutState>()((set) => ({
  definitions: [],
  layout: createToolbarLayout([]),
  pending: null,
  setDefinitions: (definitions) => set((state) => {
    if (state.definitions === definitions) return state;
    if (definitions.length === 0 && state.pending !== null) return { definitions };
    const source = state.pending === null ? state.layout : state.pending.stored;
    return { definitions, pending: null, layout: migrateToolbarLayout(source, definitions) };
  }),
  replace: (stored) => set((state) => (state.definitions.length === 0
    ? { pending: { stored } }
    : { pending: null, layout: migrateToolbarLayout(stored, state.definitions) })),
  setLayout: (layout) => set({ layout, pending: null }),
  toggle: (id) => set((state) => ({ layout: toggleToolbar(state.layout, id, state.definitions) })),
  reset: () => set((state) => ({ layout: createToolbarLayout(state.definitions), pending: null })),
}));

export { useToolbarLayoutStore };
