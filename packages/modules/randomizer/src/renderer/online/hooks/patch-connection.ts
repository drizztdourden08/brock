/* @layer renderer-shell @kind logic */
import { updateProfile, useProfilesStore } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';
import { isValidSlotName } from '../../../archipelago';
import type { ArchipelagoConnection } from '../../../augment';
import type { RandomizerGame } from '../../../contract/randomizer-game.type';
import { NO_PROFILE_REASON, NO_SLOT_NAME_REASON } from './hooks.constants';
import { reconnectSession } from './reconnect-session';

interface PatchRequest {
  profile: Profile | null;
  game: RandomizerGame<unknown> | null;
  fields: ArchipelagoConnection;
}

const patchConnection = async ({ profile, game, fields }: PatchRequest): Promise<string | null> => {
  const current = profile?.randomizer;
  if (!profile || !current) return NO_PROFILE_REASON;
  if (fields.slotName !== undefined && !isValidSlotName(fields.slotName)) return NO_SLOT_NAME_REASON;
  const merged = { ...current, ...fields };
  const next = game?.archipelago?.patched?.(merged) ?? merged;
  const updated = await updateProfile(profile.id, { randomizer: next });
  if (updated) useProfilesStore.getState().setActive(updated);
  await useProfilesStore.getState().refresh();
  reconnectSession(next);
  return null;
};

export { patchConnection };
