/* @layer renderer-shell @kind hook */
import { createSessionStore } from './create-session-store';
import type { ScreenStateState } from './screen-state.type';

const useScreenStateStore = createSessionStore<ScreenStateState>((set) => ({
  byScope: {},
  put: (scope, key, value) => set((state) => ({
    byScope: { ...state.byScope, [scope]: { ...(state.byScope[scope] ?? {}), [key]: value } },
  })),
  drop: (scope, keys) => set((state) => {
    const kept = Object.fromEntries(Object.entries(state.byScope[scope] ?? {}).filter(([key]) => !keys.includes(key)));
    return { byScope: { ...state.byScope, [scope]: kept } };
  }),
  hydrate: (states) => set({ byScope: states }),
}));

export { useScreenStateStore };
