/* @layer renderer-shell @kind logic */
import { useRandomizerGameStore } from './useRandomizerGameStore';
import type { RegisteredGame } from '../randomizer-game-state.type';

const useRandomizerGame = (): RegisteredGame | null => useRandomizerGameStore((s) => s.game);

export { useRandomizerGame };
