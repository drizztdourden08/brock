/* @layer renderer-shell @kind logic */
import { NO_PARAMS } from './navigation.constants';
import type { ScreenParams } from './navigation.type';
import { navigationSteps } from './navigation-steps';
import { resolveRoute } from './resolve-route';
import { routeAliases } from './route-aliases';
import { useNavigationStore } from './useNavigationStore';

const nav = {
  open: (id: string, params?: ScreenParams): void => useNavigationStore.getState().open(id, params),
  home: (id: string): void => useNavigationStore.getState().open(id, NO_PARAMS, { fresh: true }),
  close: (): void => useNavigationStore.getState().close(),
  back: (): boolean => useNavigationStore.getState().back(),
  up: (parent: ScreenParams): void => useNavigationStore.getState().up(parent),
  escape: (): void => {
    const state = useNavigationStore.getState();
    if (state.escapeTo !== null) state.up(state.escapeTo);
    else if (state.parent !== null) state.up(state.parent);
    else state.close();
  },
  canGoBack: (): boolean => navigationSteps.canGoBack(useNavigationStore.getState()),
  active: (): string | null => useNavigationStore.getState().active,
  toggle: (id: string, params?: ScreenParams): void => {
    const state = useNavigationStore.getState();
    const target = resolveRoute(id, params ?? {}, routeAliases.get);
    const shown = state.active === target.active && state.params.section === target.params.section;
    if (shown) state.close();
    else state.open(id, params);
  },
};

export { nav };
