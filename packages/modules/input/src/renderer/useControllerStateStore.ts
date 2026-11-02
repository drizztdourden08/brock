/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { ControllerStateStore } from './controller-state-store.type';
import { inputApi } from './input-api';
import { isInputAvailable } from './is-input-available';

let unsubscribeState: (() => void) | null = null;

const useControllerStateStore = create<ControllerStateStore>()((set) => ({
  states: {},

  listen: () => {
    if (unsubscribeState || !isInputAvailable()) return;
    const api = inputApi();
    const stops = [
      api.onState((deviceKey, buttons, axes) =>
        set((s) => ({ states: { ...s.states, [deviceKey]: { buttons, axes } } }))),
      api.capture.onHoldChanged(() => set({ states: {} })),
    ];
    unsubscribeState = () => { for (const stop of stops) stop(); };
  },
}));

export { useControllerStateStore };
