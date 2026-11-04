/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import type { RandomizerGameState } from '../randomizer-game-state.type';

const useRandomizerGameStore = create<RandomizerGameState>((set) => ({
  game: null,
  register: (game) => set({ game }),
}));

export { useRandomizerGameStore };
