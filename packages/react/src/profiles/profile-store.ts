/* @layer renderer-shell @kind logic */
import type { ProfileStore } from '@drizztdourden08/brock-core';
import { createProfileStore } from '@drizztdourden08/brock-core';
import { getPlatform } from '../platform/get-platform';
import { profileStoreState } from './profile-store-state';

const profileStore = (): ProfileStore => {
  profileStoreState.store ??= createProfileStore(getPlatform().files, profileStoreState.hooks);
  return profileStoreState.store;
};

export { profileStore };
