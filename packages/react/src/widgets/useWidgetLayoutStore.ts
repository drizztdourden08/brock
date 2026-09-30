/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { createDefaultLayout, getWidgetDefinition, isWidgetOpen, migrateLayout, openWidget, popOutWidget, removeEverywhere } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { WidgetDef, WidgetLayoutState } from './widget.type';

const toggled = (layout: WidgetLayout, id: string, definitions: readonly WidgetDef[]): WidgetLayout =>
  (isWidgetOpen(layout, id) ? removeEverywhere(layout, id) : openWidget(layout, id, definitions));

const useWidgetLayoutStore = create<WidgetLayoutState>()((set) => ({
  definitions: [],
  layout: createDefaultLayout(),
  externalDrag: null,
  setDefinitions: (definitions) => set({ definitions }),
  replace: (stored) => set({ layout: migrateLayout(stored) }),
  setLayout: (layout) => set({ layout }),
  change: (fn) => set((state) => ({ layout: fn(state.layout) })),
  setExternalDrag: (externalDrag) => set({ externalDrag }),
  open: (id) => set((state) => ({ layout: openWidget(state.layout, id, state.definitions) })),
  close: (id) => set((state) => ({ layout: removeEverywhere(state.layout, id) })),
  toggle: (id) => set((state) => ({ layout: toggled(state.layout, id, state.definitions) })),
  popOut: (id) => set((state) => (
    getWidgetDefinition(state.definitions, id)?.popOut === true ? { layout: popOutWidget(state.layout, id) } : {}
  )),
}));

export { useWidgetLayoutStore };
