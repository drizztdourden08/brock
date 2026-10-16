/* @layer renderer-shell @kind types */
import type { CreateProfileOptions, Profile } from '@drizztdourden08/brock-core';

type BeforeProfileRemove = (profile: Profile) => boolean | undefined | Promise<boolean | undefined>;

interface ProfileRemovalRegistry {
  add: (guard: BeforeProfileRemove) => () => void;
  allows: (profile: Profile) => Promise<boolean>;
}

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
  removeConfirmed: (profile: Profile) => Promise<boolean>;
  refresh: () => Promise<Profile[]>;
}

export type { BeforeProfileRemove, ProfileRemovalRegistry, ProfilesState, UseProfilesResult };
