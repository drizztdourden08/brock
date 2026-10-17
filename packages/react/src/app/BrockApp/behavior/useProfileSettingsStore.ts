/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { readConfig } from '../../../profiles/read-config';
import { writeConfig } from '../../../profiles/write-config';
import { createSettingsStore } from '../../../stores/create-settings-store';
import type { SettingsStore } from '../../../stores/settings-store.type';
import type { DeveloperToolsSource } from '../../../developer-tools/developer-tools.type';
import { useDeveloperToolsSource } from '../../../developer-tools/useDeveloperToolsSource';
import type { BrockAppSettings } from '../BrockApp.type';

const useProfileSettingsStore = <S extends object>(settings: BrockAppSettings<S>, developerTools?: DeveloperToolsSource): SettingsStore<S> => {
  const store = useMemo(() => createSettingsStore<S>({
    defaults: settings.defaults,
    effects: settings.effects,
    normalise: settings.normalise,
    transformPatch: settings.transformPatch,
    load: async (profileId) => (await readConfig(profileId)) as Partial<S> | null,
    save: (profileId, next) => writeConfig(profileId, next as Record<string, unknown>),
  }), []);
  useDeveloperToolsSource(developerTools, store);
  return store;
};

export { useProfileSettingsStore };
