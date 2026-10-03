/* @layer renderer-shell @kind hook */
import { useContext, useEffect } from 'react';
import type { WidgetSlice } from '@drizztdourden08/brock-core';
import { hostApi } from '../../../host/host-api';
import { isReviewLaunch } from '../../../host/is-review-launch';
import { SettingsStoreContext } from '../../../stores/settings-context';
import { useWidgetPrefStore } from '../../../stores/useWidgetPrefStore';
import type { WidgetPrefs } from '../../../stores/widget-pref.type';
import { RELAY_LOG_LIMIT, RELAY_SLICES } from '../../widget.constants';
import type { SettingsSlice } from '../../widget.type';
import { relayWidgetPrefs } from '../../relay-widget-prefs';
import { relayWidgetSettings } from '../../relay-widget-settings';
import { useWidgetRelayStore } from '../../useWidgetRelayStore';

const useWidgetRelay = (id: string): void => {
  const settingsStore = useContext(SettingsStoreContext);
  useEffect(() => {
    const api = hostApi();
    if (!api) return undefined;
    const prefs = relayWidgetPrefs(id, (widgetId, next) => api.setWidgetPrefs(widgetId, next));
    const settings = relayWidgetSettings(settingsStore, (patch) => api.patchWidgetSettings(patch));
    const receive = ({ kind, data }: WidgetSlice): void => {
      const relay = useWidgetRelayStore.getState();
      if (kind === RELAY_SLICES.logAppend) relay.append(RELAY_SLICES.log, Array.isArray(data) ? data : [], RELAY_LOG_LIMIT);
      else relay.receive(kind, data);
      if (kind === RELAY_SLICES.prefs) prefs.receive(data as WidgetPrefs);
      if (kind === RELAY_SLICES.settings) settings.receive(data as SettingsSlice);
    };
    const offs = [
      prefs.stop,
      settings.stop,
      api.onWidgetRelay(receive),
      isReviewLaunch() ? api.onReviewWidgetPref((key, value) => useWidgetPrefStore.getState().setPref(id, key, value)) : () => undefined,
    ];
    api.subscribeWidgetRelay(id);
    return () => {
      for (const off of offs) off();
    };
  }, [id, settingsStore]);
};

export { useWidgetRelay };
