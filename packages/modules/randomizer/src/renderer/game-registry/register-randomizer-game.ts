/* @layer renderer-shell @kind logic */
import type { DefPlacement } from '../../world';
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import { useRandomizerGameStore } from './behavior/useRandomizerGameStore';

const registerRandomizerGame = <P extends DefPlacement, A>(game: RandomizerGame<P, A>): void => {
  useRandomizerGameStore.getState().register(game);
};

export { registerRandomizerGame };
