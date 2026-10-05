/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { EMPTY_NAVIGATION as EMPTY, NO_PARAMS } from './navigation.constants';
import { navigationSteps } from './navigation-steps';
import type { NavigationState } from './navigation.type';
import { resolveRoute } from './resolve-route';
import { routeAliases } from './route-aliases';
import { whenLeft } from './when-left';

const useNavigationStore = create<NavigationState>()((set, get) => ({
  ...EMPTY,
  open: (id, params = NO_PARAMS, options = {}) => {
    const target = resolveRoute(id, params, routeAliases.get);
    if (navigationSteps.isHere(get(), target)) return;
    whenLeft(() => set(navigationSteps.open(get(), target, options.fresh)));
  },
  close: () => {
    if (get().active !== null) whenLeft(() => set(navigationSteps.close(get())));
  },
  back: () => {
    if (navigationSteps.back(get()) === null) return false;
    whenLeft(() => set(navigationSteps.back(get()) ?? {}));
    return true;
  },
  up: (parent) => {
    if (navigationSteps.up(get(), parent) !== null) whenLeft(() => set(navigationSteps.up(get(), parent) ?? {}));
  },
  setParent: (parent) => set({ parent }),
  setEscapeTo: (escapeTo) => set({ escapeTo }),
  restore: (saved) => set(saved ? { ...EMPTY, ...saved } : EMPTY),
}));

export { useNavigationStore };
