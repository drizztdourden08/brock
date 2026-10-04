/* @layer renderer-shell @kind types */
type WidgetPrefs = Record<string, Record<string, unknown>>;

interface WidgetPrefState {
  byWidget: WidgetPrefs;
  hydrated: boolean;
  setPref: (widgetId: string, key: string, value: unknown) => void;
  hydrate: (prefs: WidgetPrefs) => void;
  replaceWidget: (widgetId: string, prefs: Record<string, unknown>) => void;
}

export type { WidgetPrefs, WidgetPrefState };
