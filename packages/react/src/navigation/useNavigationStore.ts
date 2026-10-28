/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { EMPTY_NAVIGATION as EMPTY, NO_PARAMS } from './navigation.constants';
import { keepSticky } from './keep-sticky';
import { navigationSteps } from './navigation-steps';
import type { NavigationState } from './navigation.type';
import { resolveRoute } from './resolve-route';
import { routeAliases } from './route-aliases';
import { whenLeft } from './when-left';

const useNavigationStore = create<NavigationState>()((set, get) => ({
  ...EMPTY,
  open: (id, params = NO_PARAMS, options = {}) => {
    const target = keepSticky(get(), resolveRoute(id, params, routeAliases.get), options.fresh);
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
  reopen: () => {
    const step = navigationSteps.reopen(get());
    if (step !== null) set(step);
    return step !== null;
  },
  setParent: (parent) => set({ parent }),
  restore: (saved) => set(saved ? { ...EMPTY, ...saved, closed: saved.closed ?? null } : EMPTY),
}));

export { useNavigationStore };
