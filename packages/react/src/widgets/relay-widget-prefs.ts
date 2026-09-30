/* @layer renderer-shell @kind logic */
import type { WidgetPrefsWire } from '@drizztdourden08/brock-core';
import { useWidgetPrefStore } from '../stores/useWidgetPrefStore';
import type { WidgetPrefs } from '../stores/widget-pref.type';

const relayWidgetPrefs = (id: string, send: (id: string, prefs: WidgetPrefsWire) => void) => {
  let applying = false;
  const receive = (prefs: WidgetPrefs): void => {
    applying = true;
    useWidgetPrefStore.getState().hydrate(prefs);
    applying = false;
  };
  const stop = useWidgetPrefStore.subscribe((state, prev) => {
    const next = state.byWidget[id];
    if (!applying && next !== prev.byWidget[id]) send(id, next ?? {});
  });
  return { receive, stop };
};

export { relayWidgetPrefs };
