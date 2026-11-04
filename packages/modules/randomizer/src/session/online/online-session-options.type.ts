/* @layer core @kind types */
import type { OnlineConnection } from '../../archipelago';
import type { ArchipelagoGame } from '../../contract/archipelago-game.type';
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { RandomizerLog } from '../../contract/randomizer-log.type';

type OnlineSource = 'profile' | 'manual';

interface OnlineSessionOptions<P, A> {
  game: RandomizerGame<P, A>;
  ap: ArchipelagoGame<P, A>;
  connection: OnlineConnection | null;
  source: OnlineSource;
  log: RandomizerLog;
}

export type { OnlineSessionOptions, OnlineSource };
