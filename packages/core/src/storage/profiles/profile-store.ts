/* @layer core @kind logic */
import type { CreateProfileOptions, Profile, ProfilePatch } from '../../augment';
import type { FileStore } from '../../platform/ports/file-store.type';
import type { ProfileStore, ProfileStoreHooks } from './profile-store.type';
import { readJson } from '../read-json';
import { writeJson } from '../write-json';
import { newId } from '../id';
import { updateAppState } from '../update-app-state';
import { profileDir } from './profile-dir';
import { profileFile } from './profile-file';
import { configFile } from './config-file';

const applyPatch = (profile: Profile, patch: ProfilePatch, patchable: readonly string[]): void => {
  if (patch.name != null) profile.name = patch.name;
  for (const key of patchable) {
    const value: unknown = Reflect.get(patch, key);
    if (value === undefined) continue;
    if (value === null) Reflect.deleteProperty(profile, key);
    else Reflect.set(profile, key, value);
  }
};

const createProfileStore = (files: FileStore, hooks: ProfileStoreHooks = {}): ProfileStore => {
  const load = async (id: string): Promise<Profile | null> => readJson<Profile | null>(files, profileFile(id), null);

  const list = async (): Promise<Profile[]> => {
    const ids = await files.list('profiles');
    const loaded = await Promise.all(ids.map(load));
    return loaded.filter((p): p is Profile => p !== null).sort((a, b) => b.lastPlayed - a.lastPlayed);
  };

  const create = async (opts: CreateProfileOptions): Promise<Profile> => {
    const now = Date.now();
    const profile = {
      id: newId(),
      name: opts.name,
      created: now,
      lastPlayed: now,
      ...(hooks.build?.(opts) ?? {}),
    } as Profile;
    await files.mkdir(profileDir(profile.id));
    await writeJson(files, profileFile(profile.id), profile);
    await writeJson(files, configFile(profile.id), opts.initialConfig ?? {});
    await hooks.onCreate?.(profile, files);
    return profile;
  };

  const update = async (id: string, patch: ProfilePatch): Promise<Profile | null> => {
    const profile = await load(id);
    if (!profile) return null;
    applyPatch(profile, patch, hooks.patchable ?? []);
    await writeJson(files, profileFile(id), profile);
    return profile;
  };

  const remove = async (id: string): Promise<void> => {
    await files.remove(profileDir(id));
    await updateAppState(files, (state) => (state.lastProfileId === id ? { ...state, lastProfileId: null } : state));
  };

  const setLast = async (id: string): Promise<void> => {
    await updateAppState(files, (state) => ({ ...state, lastProfileId: id }));
  };

  const touch = async (id: string): Promise<void> => {
    const profile = await load(id);
    if (profile) await writeJson(files, profileFile(id), { ...profile, lastPlayed: Date.now() });
  };

  const readConfig = async (id: string): Promise<Record<string, unknown> | null> =>
    readJson<Record<string, unknown> | null>(files, configFile(id), null);

  const writeConfig = async (id: string, settings: Record<string, unknown>): Promise<void> =>
    writeJson(files, configFile(id), settings);

  return { list, load, create, update, remove, setLast, touch, readConfig, writeConfig };
};

export { createProfileStore };
