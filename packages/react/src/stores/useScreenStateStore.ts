/* @layer renderer-shell @kind hook */
import { createSessionStore } from './create-session-store';
import type { ScreenStateState } from './screen-state.type';

const useScreenStateStore = createSessionStore<ScreenStateState>((set) => ({
  byScope: {},
  put: (scope, key, value) => set((state) => ({
    byScope: { ...state.byScope, [scope]: { ...(state.byScope[scope] ?? {}), [key]: value } },
  })),
  hydrate: (states) => set({ byScope: states }),
}));

export { useScreenStateStore };
