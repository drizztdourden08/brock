/* @layer renderer-shell @kind logic */
import { profileDir, writeJson } from '@drizztdourden08/brock-core';
import { getPlatform } from '@drizztdourden08/brock-react';
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import { placementPath } from './placement-path';
import { stampOf } from './stamp-of';

const writePlacement = async <P, A>(game: RandomizerGame<P, A>, profileId: string, placement: P): Promise<void> => {
  const { files } = getPlatform();
  await files.mkdir(profileDir(profileId));
  await writeJson(files, placementPath(profileId), Object.assign({ stamp: stampOf(game) }, placement));
};

export { writePlacement };
