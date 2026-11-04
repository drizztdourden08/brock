/* @layer renderer-shell @kind logic */
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import { useRandomizerGameStore } from './behavior/useRandomizerGameStore';

const registerRandomizerGame = <P, A>(game: RandomizerGame<P, A>): void => {
  useRandomizerGameStore.getState().register(game);
};

export { registerRandomizerGame };
