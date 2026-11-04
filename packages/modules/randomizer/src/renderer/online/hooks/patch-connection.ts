/* @layer renderer-shell @kind logic */
import { updateProfile, useProfilesStore } from '@drizztdourden08/brock-react';
import { isValidSlotName } from '../../../archipelago';
import { NO_PROFILE_REASON, NO_SLOT_NAME_REASON } from './hooks.constants';
import type { PatchRequest } from './patch-connection.type';
import { patchedRandomizer } from './patched-randomizer';
import { reconnectSession } from './reconnect-session';

const patchConnection = async ({ profile, game, fields }: PatchRequest): Promise<string | null> => {
  const current = profile?.randomizer;
  if (!profile || !current) return NO_PROFILE_REASON;
  if (fields.slotName !== undefined && !isValidSlotName(fields.slotName)) return NO_SLOT_NAME_REASON;
  const next = patchedRandomizer(current, fields, game);
  const updated = await updateProfile(profile.id, { randomizer: next });
  if (updated) useProfilesStore.getState().setActive(updated);
  await useProfilesStore.getState().refresh();
  reconnectSession(next);
  return null;
};

export { patchConnection };
