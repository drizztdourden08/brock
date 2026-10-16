/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { INSPECT_DEFAULTS } from './inspect-store.constants';
import type { InspectState } from './inspect-store.type';

const useInspectStore = create<InspectState>()((set) => ({
  ...INSPECT_DEFAULTS,
  pointer: null,
  view: null,
  setGrid: (grid) => set({ grid }),
  setCentre: (centre) => set({ centre }),
  track: (pointer, view) => set({ pointer, view }),
  reset: () => set(INSPECT_DEFAULTS),
}));

export { useInspectStore };
