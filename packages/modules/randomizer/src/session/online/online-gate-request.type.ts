/* @layer core @kind types */
import type { RandomizerProfileConfig } from '../../augment';
import type { ArchipelagoGame } from '../../contract/archipelago-game.type';
import type { RandomizerLog } from '../../contract/randomizer-log.type';

interface OnlineGateRequest<P, A> {
  ap: ArchipelagoGame<P, A>;
  profileId: string;
  config: RandomizerProfileConfig;
  log: RandomizerLog;
}

export type { OnlineGateRequest };
