/* @layer renderer-shell @kind logic */
import { focusKeep } from './focus-keep';
import { focusMode } from './focus-mode';
import { useFocusModeStore } from './useFocusModeStore';

const layout = {
  focusMode,
  focusKeep,
  isFocusMode: (): boolean => useFocusModeStore.getState().on,
  subscribeFocusMode: (listener: (on: boolean) => void): (() => void) => useFocusModeStore.subscribe((state, prev) => {
    if (state.on !== prev.on) listener(state.on);
  }),
};

export { layout };
