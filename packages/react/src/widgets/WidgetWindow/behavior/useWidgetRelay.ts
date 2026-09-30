/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { hostApi } from '../../../host/host-api';
import { useWidgetPrefStore } from '../../../stores/useWidgetPrefStore';
import type { WidgetPrefs } from '../../../stores/widget-pref.type';
import { RELAY_SLICES } from '../../widget.constants';
import { useWidgetRelayStore } from '../../useWidgetRelayStore';

const useWidgetRelay = (id: string): void => {
  useEffect(() => {
    const api = hostApi();
    if (!api) return undefined;
    const off = api.onWidgetRelay(({ kind, data }) => {
      useWidgetRelayStore.getState().receive(kind, data);
      if (kind === RELAY_SLICES.prefs) useWidgetPrefStore.getState().hydrate(data as WidgetPrefs);
    });
    api.subscribeWidgetRelay(id);
    return off;
  }, [id]);
};

export { useWidgetRelay };
