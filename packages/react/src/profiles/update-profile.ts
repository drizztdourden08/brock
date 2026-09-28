/* @layer renderer-shell @kind logic */
import type { Profile, ProfilePatch } from '@drizztdourden08/brock-core';
import { profileStore } from './profile-store';

const updateProfile = (id: string, patch: ProfilePatch): Promise<Profile | null> => profileStore().update(id, patch);

export { updateProfile };
