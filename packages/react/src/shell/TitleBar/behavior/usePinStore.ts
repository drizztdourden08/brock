/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { PinState } from './pin-state.type';

const usePinStore = create<PinState>()((set) => ({
  pinned: false,
  setPinned: (pinned) => set({ pinned }),
}));

export { usePinStore };
