/* @layer renderer-shell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import { profileStore } from './profile-store';

const loadProfile = (id: string): Promise<Profile | null> => profileStore().load(id);

export { loadProfile };
