/* @layer renderer-shell @kind types */
import type { RandomizerGame } from '../../contract/randomizer-game.type';

type RegisteredGame = RandomizerGame<unknown, unknown>;

interface RandomizerGameState {
  game: RegisteredGame | null;
  register(game: RegisteredGame): void;
}

export type { RandomizerGameState, RegisteredGame };
