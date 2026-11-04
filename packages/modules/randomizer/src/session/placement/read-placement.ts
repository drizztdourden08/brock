/* @layer renderer-shell @kind logic */
import { readJson } from '@drizztdourden08/brock-core';
import { getPlatform } from '@drizztdourden08/brock-react';
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import { placementFromRaw } from './placement-from-raw';
import { placementPath } from './placement-path';

const readPlacement = async <P, A>(game: RandomizerGame<P, A>, profileId: string): Promise<P | null> => {
  const raw = await readJson<unknown>(getPlatform().files, placementPath(profileId), null);
  return placementFromRaw(game, raw);
};

export { readPlacement };
