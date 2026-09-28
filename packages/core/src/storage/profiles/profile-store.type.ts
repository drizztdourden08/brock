/* @layer core @kind types */
import type { CreateProfileOptions, Profile, ProfileExtension, ProfilePatch } from '../../augment';
import type { FileStore } from '../../platform/ports/file-store.type';

interface ProfileStoreHooks {
  build?: (opts: CreateProfileOptions) => ProfileExtension;
  patchable?: readonly string[];
  onCreate?: (profile: Profile, files: FileStore) => Promise<void>;
}

interface ProfileStore {
  list: () => Promise<Profile[]>;
  load: (id: string) => Promise<Profile | null>;
  create: (opts: CreateProfileOptions) => Promise<Profile>;
  update: (id: string, patch: ProfilePatch) => Promise<Profile | null>;
  remove: (id: string) => Promise<void>;
  setLast: (id: string) => Promise<void>;
  touch: (id: string) => Promise<void>;
  readConfig: (id: string) => Promise<Record<string, unknown> | null>;
  writeConfig: (id: string, settings: Record<string, unknown>) => Promise<void>;
}

export type { ProfileStore, ProfileStoreHooks };
