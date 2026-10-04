/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import { mergeSettings } from '@drizztdourden08/brock-core';
import { createSettingsSaver } from './create-settings-saver';
import { DEFAULT_SAVE_DELAY_MS, NO_SAVE } from './settings-store.constants';
import type { CreateSettingsStoreOptions, SettingsEffect, SettingsState, SettingsStore } from './settings-store.type';

const createSettingsStore = <S extends object>(options: CreateSettingsStoreOptions<S>): SettingsStore<S> => {
  const { defaults, load, save, saveDelayMs = DEFAULT_SAVE_DELAY_MS } = options;
  const effects = new Set<SettingsEffect<S>>(options.effects ?? []);
  const saver = createSettingsSaver(save, saveDelayMs, (report) => store.setState(report));
  let hydration = 0;

  const store = create<SettingsState<S>>()((set, get) => ({
    settings: defaults,
    hydrated: false,
    profileId: null,
    ...NO_SAVE,

    hydrate: async (profileId) => {
      const token = ++hydration;
      await saver.flush();
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
      if (profileId) saver.schedule(profileId, next);
    },

    retrySave: saver.retry,

    reset: () => {
      hydration += 1;
      saver.clear();
      set({ settings: defaults, hydrated: false, profileId: null, ...NO_SAVE });
    },
  }));

  const addEffect = (effect: SettingsEffect<S>): (() => void) => {
    effects.add(effect);
    return () => effects.delete(effect);
  };

  return Object.assign(store, { addEffect, flush: saver.flush });
};

export { createSettingsStore };
