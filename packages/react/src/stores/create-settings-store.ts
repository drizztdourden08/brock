/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import { mergeSettings } from '@drizztdourden08/brock-core';
import { DEFAULT_SAVE_DELAY_MS } from './settings-store.constants';
import type { CreateSettingsStoreOptions, SettingsEffect, SettingsState, SettingsStore } from './settings-store.type';

const createSettingsStore = <S extends object>(options: CreateSettingsStoreOptions<S>): SettingsStore<S> => {
  const { defaults, load, save, saveDelayMs = DEFAULT_SAVE_DELAY_MS } = options;
  const effects = new Set<SettingsEffect<S>>(options.effects ?? []);
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: { profileId: string; settings: S } | null = null;
  let hydration = 0;

  const flush = async (): Promise<void> => {
    if (timer) { clearTimeout(timer); timer = null; }
    const write = pending;
    pending = null;
    if (write) await save(write.profileId, write.settings);
  };

  const schedule = (profileId: string, settings: S): void => {
    pending = { profileId, settings };
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { void flush(); }, saveDelayMs);
  };

  const store = create<SettingsState<S>>()((set, get) => ({
    settings: defaults,
    hydrated: false,
    profileId: null,

    hydrate: async (profileId) => {
      const token = ++hydration;
      await flush();
      set({ hydrated: false, profileId });
      const stored = await load(profileId);
      if (token !== hydration) return;
      set({ settings: mergeSettings(defaults, stored), hydrated: true });
    },

    patch: (patch) => {
      const prev = get().settings;
      const next = { ...prev, ...patch };
      set({ settings: next });
      for (const effect of effects) effect(patch, next, prev);
      const { profileId } = get();
      if (profileId) schedule(profileId, next);
    },

    reset: () => {
      hydration += 1;
      if (timer) { clearTimeout(timer); timer = null; }
      pending = null;
      set({ settings: defaults, hydrated: false, profileId: null });
    },
  }));

  const addEffect = (effect: SettingsEffect<S>): (() => void) => {
    effects.add(effect);
    return () => effects.delete(effect);
  };

  return Object.assign(store, { addEffect, flush });
};

export { createSettingsStore };
