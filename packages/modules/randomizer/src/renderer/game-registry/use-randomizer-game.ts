/* @layer renderer-shell @kind logic */
import { useRandomizerGameStore } from './randomizer-game-store';
import type { RegisteredGame } from './randomizer-game-state.type';

const useRandomizerGame = (): RegisteredGame | null => useRandomizerGameStore((s) => s.game);

export { useRandomizerGame };
