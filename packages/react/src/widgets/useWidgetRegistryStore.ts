/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { WidgetRegistryState } from './widget.type';

const useWidgetRegistryStore = create<WidgetRegistryState>()((set) => ({
  registered: [],
  add: (definitions) => {
    const added = new Set(definitions);
    set((state) => ({ registered: [...state.registered, ...definitions] }));
    return () => set((state) => ({ registered: state.registered.filter((def) => !added.has(def)) }));
  },
}));

export { useWidgetRegistryStore };
