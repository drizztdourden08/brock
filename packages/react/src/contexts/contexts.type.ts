/* @layer renderer-shell @kind types */
interface AppContext<T = unknown> {
  active: boolean;
  data?: T;
}

type AppContexts = Record<string, AppContext>;

interface ContextsState {
  contexts: AppContexts;
  set: (name: string, value: AppContext) => void;
  clear: (name: string) => void;
  hydrate: (contexts: unknown) => void;
}

export type { AppContext, AppContexts, ContextsState };
