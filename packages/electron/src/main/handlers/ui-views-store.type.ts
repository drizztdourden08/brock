/* @layer electron-main @kind types */
type Views = Record<string, unknown>;

interface UiViewsStore {
  load: () => Promise<Views>;
  save: (data: Views) => Promise<void>;
  patch: (entries: Views) => Promise<void>;
}

export type { UiViewsStore, Views };
