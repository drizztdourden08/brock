/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { hostApi } from '../../../host/host-api';
import type { SettingsStore } from '../../../stores/settings-store.type';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { useWidgetPrefStore } from '../../../stores/useWidgetPrefStore';
import { relayLog } from '../../relay-log';
import { RELAY_SLICES } from '../../widget.constants';
import type { SettingsSlice } from '../../widget.type';
import { useWidgetLayoutStore } from '../../useWidgetLayoutStore';

const publish = (kind: string, data: unknown): void => hostApi()?.publishWidgetSlice({ kind, data });

const settingsOf = (settingsStore: SettingsStore<object> | null): SettingsSlice => ({
  profile: useProfilesStore.getState().active,
  settings: { ...settingsStore?.getState().settings },
});

const relay = (settingsStore: SettingsStore<object> | null): (() => void) => {
  const api = hostApi();
  if (!api) return () => undefined;
  const log = relayLog(publish);
  const sendSettings = (): void => publish(RELAY_SLICES.settings, settingsOf(settingsStore));
  const snapshot = (): void => {
    publish(RELAY_SLICES.frames, useWidgetLayoutStore.getState().layout.frame);
    publish(RELAY_SLICES.prefs, useWidgetPrefStore.getState().byWidget);
    sendSettings();
    log.sendAll();
  };
  const offs = [
    log.stop,
    api.onWidgetSnapshotRequest(snapshot),
    api.onWidgetSettingsPatch((patch) => settingsStore?.getState().patch(patch)),
    useWidgetLayoutStore.subscribe((state, prev) => {
      if (state.layout.frame !== prev.layout.frame) publish(RELAY_SLICES.frames, state.layout.frame);
    }),
    useWidgetPrefStore.subscribe((state, prev) => {
      if (state.byWidget !== prev.byWidget) publish(RELAY_SLICES.prefs, state.byWidget);
    }),
    useProfilesStore.subscribe((state, prev) => {
      if (state.active !== prev.active) sendSettings();
    }),
    settingsStore?.subscribe((state, prev) => {
      if (state.settings !== prev.settings) sendSettings();
    }) ?? (() => undefined),
  ];
  snapshot();
  return () => {
    for (const off of offs) off();
  };
};

const useWidgetRelayPublisher = (settingsStore: SettingsStore<object> | null): void => {
  const active = useWidgetLayoutStore((s) => s.layout.popped.length > 0);
  useEffect(() => (active ? relay(settingsStore) : undefined), [active, settingsStore]);
};

export { useWidgetRelayPublisher };
