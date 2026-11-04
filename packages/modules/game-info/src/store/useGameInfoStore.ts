/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import type { GameInfoState } from './game-info-state.type';
import { EMPTY } from './game-info-store.constants';

const useGameInfoStore = create<GameInfoState>((set) => ({
  ...EMPTY,
  publish: (next) => set({ ...next, snapshotAt: Date.now() }),
  setRunning: (on) => set({ running: on }),
  reset: () => set({ ...EMPTY }),
}));

export { useGameInfoStore };
