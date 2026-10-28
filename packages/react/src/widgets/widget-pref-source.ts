/* @layer renderer-shell @kind logic */
import { useWidgetPrefStore } from '../stores/useWidgetPrefStore';
import type { SettingsValueSource } from '../settings/settings.type';
import type { WidgetDef } from './widget.type';

const widgetPrefSource = (def: Pick<WidgetDef, 'id' | 'prefs'>): SettingsValueSource => {
  const defaults = new Map((def.prefs ?? []).map((item) => [item.key, item.default]));
  return {
    get: (key) => useWidgetPrefStore.getState().byWidget[def.id]?.[key] ?? defaults.get(key),
    set: (key, value) => useWidgetPrefStore.getState().setPref(def.id, key, value),
    subscribe: (listener) => useWidgetPrefStore.subscribe((state, prev) => {
      if (state.byWidget[def.id] !== prev.byWidget[def.id]) listener();
    }),
  };
};

export { widgetPrefSource };
