/* @layer renderer-shell @kind types */
import type { CreateProfileOptions, Profile } from '@drizztdourden08/brock-core';

interface ProfilesState {
  profiles: Profile[];
  active: Profile | null;
  lastProfileId: string | null;
  loaded: boolean;
  refresh: () => Promise<Profile[]>;
  setActive: (profile: Profile | null) => void;
  select: (profile: Profile) => Promise<void>;
  create: (opts: CreateProfileOptions) => Promise<Profile>;
  rename: (id: string, name: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

interface UseProfilesResult {
  profiles: Profile[];
  active: Profile | null;
  lastProfileId: string | null;
  loaded: boolean;
  select: (profile: Profile) => Promise<void>;
  create: (opts: CreateProfileOptions) => Promise<Profile>;
  rename: (profile: Profile, name: string) => Promise<void>;
  remove: (profile: Profile) => void;
  removeConfirmed: (profile: Profile) => void;
  refresh: () => Promise<Profile[]>;
}

export type { ProfilesState, UseProfilesResult };
