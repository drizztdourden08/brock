/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { hostApi } from '../../../host/host-api';
import { isReviewLaunch } from '../../../host/is-review-launch';
import { useWidgetPrefStore } from '../../../stores/useWidgetPrefStore';
import type { WidgetPrefs } from '../../../stores/widget-pref.type';
import { RELAY_SLICES } from '../../widget.constants';
import { relayWidgetPrefs } from '../../relay-widget-prefs';
import { useWidgetRelayStore } from '../../useWidgetRelayStore';

const useWidgetRelay = (id: string): void => {
  useEffect(() => {
    const api = hostApi();
    if (!api) return undefined;
    const prefs = relayWidgetPrefs(id, (widgetId, next) => api.setWidgetPrefs(widgetId, next));
    const offs = [
      prefs.stop,
      api.onWidgetRelay(({ kind, data }) => {
        useWidgetRelayStore.getState().receive(kind, data);
        if (kind === RELAY_SLICES.prefs) prefs.receive(data as WidgetPrefs);
      }),
      isReviewLaunch() ? api.onReviewWidgetPref((key, value) => useWidgetPrefStore.getState().setPref(id, key, value)) : () => undefined,
    ];
    api.subscribeWidgetRelay(id);
    return () => {
      for (const off of offs) off();
    };
  }, [id]);
};

export { useWidgetRelay };
