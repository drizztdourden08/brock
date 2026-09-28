/* @layer renderer-shell @kind logic */
import type { ScreenParams } from './navigation.type';
import { useNavigationStore } from './useNavigationStore';

const nav = {
  open: (id: string, params?: ScreenParams): void => useNavigationStore.getState().open(id, params),
  close: (): void => useNavigationStore.getState().close(),
  active: (): string | null => useNavigationStore.getState().active,
  toggle: (id: string, params?: ScreenParams): void => {
    const state = useNavigationStore.getState();
    if (state.active === id) state.close();
    else state.open(id, params);
  },
};

export { nav };
