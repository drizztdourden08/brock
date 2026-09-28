/* @layer renderer-shell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import { profileStore } from './profile-store';

const listProfiles = (): Promise<Profile[]> => profileStore().list();

export { listProfiles };
