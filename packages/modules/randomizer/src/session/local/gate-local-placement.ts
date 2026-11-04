/* @layer renderer-shell @kind logic */
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import type { RandomizerProfileConfig } from '../../augment';
import { readPlacement } from '../placement/read-placement';
import { sizeOfField } from '../placement/size-of-field';
import type { PendingBoot } from '../store/pending-boot.type';
import { LOCAL_KIND } from './local-session.constants';
import { rerollPlacement } from './reroll-placement';

const gateLocalPlacement = async <P, A>(
  game: RandomizerGame<P, A>,
  profileId: string,
  config: RandomizerProfileConfig,
  log: RandomizerLog,
): Promise<PendingBoot | null> => {
  const placement = await readPlacement(game, profileId) ?? await rerollPlacement(game, profileId, config, log);
  if (placement === null) return null;
  log(`[Boot] Gate passed: local placement loaded (seed ${config.seed}, ${sizeOfField(placement, 'locations')} locations, ${sizeOfField(placement, 'spheres')} spheres)`);
  return { profileId, mode: LOCAL_KIND, config, placement };
};

export { gateLocalPlacement };
