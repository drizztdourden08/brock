/* @layer renderer-shell @kind types */
type Views = Record<string, unknown>;

interface UiViewsSource {
  load: () => Promise<Views>;
  save: (all: Views, changed: Views) => Promise<void>;
}

export type { UiViewsSource, Views };
