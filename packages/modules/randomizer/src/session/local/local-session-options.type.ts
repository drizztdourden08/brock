/* @layer core @kind types */
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { RandomizerLog } from '../../contract/randomizer-log.type';

interface LocalSessionOptions<P, A> {
  game: RandomizerGame<P, A>;
  placement: P;
  seed: string;
  log: RandomizerLog;
}

export type { LocalSessionOptions };
