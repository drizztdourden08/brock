/* @layer renderer-shell @kind logic */
import { updateProfile, useProfilesStore } from '@drizztdourden08/brock-react';
import type { Profile, ProfilePatch } from '@drizztdourden08/brock-core';

const updateLobbyProfile = async (id: string, patch: ProfilePatch): Promise<Profile | null> => {
  const updated = await updateProfile(id, patch);
  const store = useProfilesStore.getState();
  if (updated && store.active?.id === id) store.setActive(updated);
  await store.refresh();
  return updated;
};

export { updateLobbyProfile };
