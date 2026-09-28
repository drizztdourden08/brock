/* @layer renderer-shell @kind logic */
import type { ProfileStore, ProfileStoreHooks } from '@drizztdourden08/brock-core';

const profileStoreState: { hooks: ProfileStoreHooks; store: ProfileStore | null } = { hooks: {}, store: null };

export { profileStoreState };
