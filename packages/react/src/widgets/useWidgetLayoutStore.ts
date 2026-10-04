/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { createDefaultLayout, getWidgetDefinition, isWidgetOpen, migrateLayout, openWidget, popOutWidget, removeEverywhere } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { dockOrigins } from './dock-origins';
import { dropWindowGroups } from './drop-window-groups';
import { presetLayout } from './preset-layout';
import type { WidgetDef, WidgetLayoutState } from './widget.type';

const toggled = (layout: WidgetLayout, id: string, definitions: readonly WidgetDef[]): WidgetLayout =>
  (isWidgetOpen(layout, id) ? removeEverywhere(layout, id) : openWidget(layout, id, definitions));

const moved = (prev: WidgetLayout, next: WidgetLayout): { layout: WidgetLayout } => {
  dockOrigins.record(prev, next);
  return { layout: next };
};

const loaded = (stored: unknown, state: WidgetLayoutState): WidgetLayout =>
  (stored === null || stored === undefined ? presetLayout(state.preset, state.definitions) : dropWindowGroups(migrateLayout(stored)));

const useWidgetLayoutStore = create<WidgetLayoutState>()((set) => ({
  definitions: [],
  preset: null,
  layout: createDefaultLayout(),
  externalDrag: null,
  setDefinitions: (definitions) => set({ definitions }),
  setPreset: (preset) => set({ preset }),
  reset: () => set((state) => moved(state.layout, presetLayout(state.preset, state.definitions))),
  replace: (stored) => set((state) => ({ layout: loaded(stored, state) })),
  setLayout: (layout) => set((state) => moved(state.layout, layout)),
  change: (fn) => set((state) => moved(state.layout, fn(state.layout))),
  setExternalDrag: (externalDrag) => set({ externalDrag }),
  open: (id) => set((state) => ({ layout: openWidget(state.layout, id, state.definitions) })),
  close: (id) => set((state) => ({ layout: removeEverywhere(state.layout, id) })),
  toggle: (id) => set((state) => ({ layout: toggled(state.layout, id, state.definitions) })),
  popOut: (id) => set((state) => (
    getWidgetDefinition(state.definitions, id)?.popOut === true ? moved(state.layout, popOutWidget(state.layout, id)) : {}
  )),
}));

export { useWidgetLayoutStore };
