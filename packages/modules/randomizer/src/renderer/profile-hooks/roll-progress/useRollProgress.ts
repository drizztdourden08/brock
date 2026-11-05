/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import type { RollProgressState } from './roll-progress.type';

const useRollProgress = create<RollProgressState>((set) => ({
  fraction: null,
  report: (fraction) => set({ fraction }),
}));

export { useRollProgress };
