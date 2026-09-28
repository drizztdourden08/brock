/* @layer renderer-shell @kind logic */
import type { ProfileStoreHooks } from '@drizztdourden08/brock-core';
import { profileStoreState } from './profile-store-state';

const configureProfileStore = (next: ProfileStoreHooks): void => {
  profileStoreState.hooks = next;
  profileStoreState.store = null;
};

export { configureProfileStore };
