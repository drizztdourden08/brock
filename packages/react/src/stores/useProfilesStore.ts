/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { createProfile } from '../profiles/create-profile';
import { deleteProfile } from '../profiles/delete-profile';
import { getAppState } from '../profiles/get-app-state';
import { listProfiles } from '../profiles/list-profiles';
import { setLastProfile } from '../profiles/set-last-profile';
import { touchProfile } from '../profiles/touch-profile';
import type { ProfilesState } from './profiles.type';

const useProfilesStore = create<ProfilesState>()((set, get) => ({
  profiles: [],
  active: null,
  lastProfileId: null,
  loaded: false,

  refresh: async () => {
    const [profiles, appState] = await Promise.all([listProfiles(), getAppState()]);
    set({ profiles, lastProfileId: appState.lastProfileId, loaded: true });
    return profiles;
  },

  setActive: (profile) => set({ active: profile }),

  select: async (profile) => {
    set({ active: profile });
    await Promise.all([setLastProfile(profile.id), touchProfile(profile.id)]);
    await get().refresh();
  },

  create: async (opts) => {
    const profile = await createProfile(opts);
    await get().refresh();
    return profile;
  },

  remove: async (id) => {
    await deleteProfile(id);
    if (get().active?.id === id) set({ active: null });
    await get().refresh();
  },
}));

export { useProfilesStore };
