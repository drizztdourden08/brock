/* @layer renderer-shell @kind types */
import type { Profile } from '@drizztdourden08/brock-core';
import type { ArchipelagoConnection } from '../../../augment';
import type { RandomizerGame } from '../../../contract/randomizer-game.type';

interface PatchRequest {
  profile: Profile | null;
  game: RandomizerGame<unknown> | null;
  fields: ArchipelagoConnection;
}

export type { PatchRequest };
