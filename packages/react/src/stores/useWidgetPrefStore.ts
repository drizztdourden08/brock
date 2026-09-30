/* @layer renderer-shell @kind hook */
import { createSessionStore } from './create-session-store';
import type { WidgetPrefState } from './widget-pref.type';

const useWidgetPrefStore = createSessionStore<WidgetPrefState>((set) => ({
  byWidget: {},
  setPref: (widgetId, key, value) => set((state) => ({
    byWidget: { ...state.byWidget, [widgetId]: { ...(state.byWidget[widgetId] ?? {}), [key]: value } },
  })),
  hydrate: (prefs) => set({ byWidget: prefs }),
  replaceWidget: (widgetId, prefs) => set((state) => ({ byWidget: { ...state.byWidget, [widgetId]: prefs } })),
}));

export { useWidgetPrefStore };
