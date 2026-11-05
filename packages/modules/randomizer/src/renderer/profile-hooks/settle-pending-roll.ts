/* @layer renderer-shell @kind logic */
import type { RandomizerProfileConfig } from '../../augment';
import { isJoinedRoll } from '../../contract/is-joined-roll';
import { writePlacement } from '../../session/placement/write-placement';
import type { RegisteredGame } from '../game-registry/randomizer-game-state.type';
import { pendingPlacements } from './pending-placements';

const settlePendingRoll = async (game: RegisteredGame, profileId: string, config: RandomizerProfileConfig): Promise<void> => {
  if (!pendingPlacements.has(config)) return;
  const outcome = pendingPlacements.get(config);
  pendingPlacements.delete(config);
  if (isJoinedRoll(outcome)) await game.onJoined?.(outcome.result, { profileId, config });
  else await writePlacement(game, profileId, outcome);
};

export { settlePendingRoll };
