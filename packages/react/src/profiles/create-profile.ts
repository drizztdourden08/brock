/* @layer renderer-shell @kind logic */
import type { CreateProfileOptions, Profile } from '@drizztdourden08/brock-core';
import { profileStore } from './profile-store';

const createProfile = (opts: CreateProfileOptions): Promise<Profile> => profileStore().create(opts);

export { createProfile };
