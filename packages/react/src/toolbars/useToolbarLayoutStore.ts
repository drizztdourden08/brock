/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { createToolbarLayout, migrateToolbarLayout, toggleToolbar } from '@drizztdourden08/tessera/composites';
import type { ToolbarLayoutState } from './toolbar.type';

const useToolbarLayoutStore = create<ToolbarLayoutState>()((set) => ({
  definitions: [],
  layout: createToolbarLayout([]),
  setDefinitions: (definitions) => set((state) => ({ definitions, layout: migrateToolbarLayout(state.layout, definitions) })),
  replace: (stored) => set((state) => ({ layout: migrateToolbarLayout(stored, state.definitions) })),
  setLayout: (layout) => set({ layout }),
  toggle: (id) => set((state) => ({ layout: toggleToolbar(state.layout, id, state.definitions) })),
  reset: () => set((state) => ({ layout: createToolbarLayout(state.definitions) })),
}));

export { useToolbarLayoutStore };
