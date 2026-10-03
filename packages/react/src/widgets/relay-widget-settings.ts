/* @layer renderer-shell @kind logic */
import type { WidgetSettingsWire } from '@drizztdourden08/brock-core';
import type { SettingsStore } from '../stores/settings-store.type';
import { useProfilesStore } from '../stores/useProfilesStore';
import type { SettingsSlice } from './widget.type';

const changedKeys = (next: object, prev: object): WidgetSettingsWire => {
  const before = new Map(Object.entries(prev));
  return Object.fromEntries(Object.entries(next).filter(([key, value]) => before.get(key) !== value));
};

const relayWidgetSettings = (settingsStore: SettingsStore<object> | null, send: (patch: WidgetSettingsWire) => void) => {
  let applying = false;
  const receive = ({ profile, settings }: SettingsSlice): void => {
    applying = true;
    if (useProfilesStore.getState().active?.id !== profile?.id) useProfilesStore.getState().setActive(profile);
    settingsStore?.setState({ settings, hydrated: true });
    applying = false;
  };
  const stop = settingsStore?.subscribe((state, prev) => {
    if (applying || state.settings === prev.settings) return;
    const patch = changedKeys(state.settings, prev.settings);
    if (Object.keys(patch).length > 0) send(patch);
  }) ?? (() => undefined);
  return { receive, stop };
};

export { relayWidgetSettings };
