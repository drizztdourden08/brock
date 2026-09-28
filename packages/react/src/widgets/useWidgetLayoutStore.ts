/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { createDefaultWidgetState, getWidgetDefinition, startingLayout, updateWidget } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { WidgetLayoutState } from './widget.type';

const withWidget = (layout: WidgetLayout, state: WidgetLayoutState, id: string): WidgetLayout => {
  if (layout.widgets.some((w) => w.id === id)) return layout;
  const def = getWidgetDefinition(state.definitions, id);
  return def ? { widgets: [...layout.widgets, createDefaultWidgetState(def, layout.widgets.length)] } : layout;
};

const useWidgetLayoutStore = create<WidgetLayoutState>()((set) => ({
  definitions: [],
  layout: { widgets: [] },
  setDefinitions: (definitions) => set((state) => ({ definitions, layout: startingLayout(definitions, state.layout) })),
  replace: (layout) => set((state) => ({ layout: startingLayout(state.definitions, layout) })),
  update: (id, patch) => set((state) => ({ layout: updateWidget(state.layout, id, patch) })),
  open: (id) => set((state) => ({ layout: updateWidget(withWidget(state.layout, state, id), id, { visible: true }) })),
  close: (id) => set((state) => ({ layout: updateWidget(state.layout, id, { visible: false }) })),
  toggle: (id) => set((state) => {
    const layout = withWidget(state.layout, state, id);
    const visible = layout.widgets.find((w) => w.id === id)?.visible ?? false;
    return { layout: updateWidget(layout, id, { visible: !visible }) };
  }),
}));

export { useWidgetLayoutStore };
