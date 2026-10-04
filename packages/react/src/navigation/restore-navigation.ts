/* @layer renderer-shell @kind logic */
import { PROFILES_SCREEN } from '../app/BrockApp/BrockApp.constants';
import { navigationSteps } from './navigation-steps';
import type { NavigationSnapshot, SavedNavigation } from './navigation.type';
import { useNavigationStore } from './useNavigationStore';

const isStartupState = (state: NavigationSnapshot, homeScreen: string): boolean =>
  state.active === null
  || state.active === PROFILES_SCREEN
  || (state.active === homeScreen && navigationSteps.isBare(state.params) && (state.history[homeScreen]?.length ?? 0) === 0);

const restoreNavigation = (saved: SavedNavigation | null, homeScreen: string): void => {
  const state = useNavigationStore.getState();
  const takeOver = saved?.active != null && isStartupState(state, homeScreen);
  state.restore({
    active: takeOver ? saved.active : state.active,
    params: takeOver ? saved.params : state.params,
    history: saved?.history ?? {},
    remembered: saved?.remembered ?? {},
  });
};

export { restoreNavigation };
