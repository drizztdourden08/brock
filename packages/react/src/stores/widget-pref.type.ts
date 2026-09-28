/* @layer renderer-shell @kind types */
type WidgetPrefs = Record<string, Record<string, unknown>>;

interface WidgetPrefState {
  byWidget: WidgetPrefs;
  setPref: (widgetId: string, key: string, value: unknown) => void;
  hydrate: (prefs: WidgetPrefs) => void;
}

export type { WidgetPrefs, WidgetPrefState };
