/* @layer renderer-shell @kind logic */
import { createSessionStore } from './create-session-store';
import type { ScopedStateState } from './scoped-state.type';
import { uiViews } from './ui-views';

const pending = new Map<string, Promise<void>>();

const useScopedStateStore = createSessionStore<ScopedStateState>((set, get) => ({
  values: {},
  loaded: {},
  load: (scopeKey) => {
    if (get().loaded[scopeKey]) return Promise.resolve();
    const running = pending.get(scopeKey) ?? uiViews.scope(scopeKey).readAll().catch(() => ({})).then((stored) => {
      pending.delete(scopeKey);
      set((state) => ({
        values: { ...state.values, [scopeKey]: { ...stored, ...(state.values[scopeKey] ?? {}) } },
        loaded: { ...state.loaded, [scopeKey]: true },
      }));
    });
    pending.set(scopeKey, running);
    return running;
  },
  setValue: (scopeKey, name, value) => {
    set((state) => ({ values: { ...state.values, [scopeKey]: { ...(state.values[scopeKey] ?? {}), [name]: value } } }));
    void uiViews.scope(scopeKey).write(name, value).catch(() => undefined);
  },
}));

export { useScopedStateStore };
