/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { readConfig } from '../../../profiles/read-config';
import { writeConfig } from '../../../profiles/write-config';
import { createSettingsStore } from '../../../stores/create-settings-store';
import type { SettingsStore } from '../../../stores/settings-store.type';
import type { BrockAppSettings } from '../BrockApp.type';

const useProfileSettingsStore = <S extends object>(settings: BrockAppSettings<S>): SettingsStore<S> =>
  useMemo(() => createSettingsStore<S>({
    defaults: settings.defaults,
    effects: settings.effects,
    load: async (profileId) => (await readConfig(profileId)) as Partial<S> | null,
    save: (profileId, next) => writeConfig(profileId, next as Record<string, unknown>),
  }), []);

export { useProfileSettingsStore };
