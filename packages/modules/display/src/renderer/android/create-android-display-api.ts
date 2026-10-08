/* @layer renderer-shell @kind logic */
import { listenNative } from '@drizztdourden08/brock-core';
import type { DisplayApi, MonitorInfo } from '../../display.type';
import type { BrockDisplayPlugin, NativeDisplayInfo } from './android-display.type';
import {
  ANDROID_MONITOR_ID, ANDROID_MONITOR_LABEL, ANDROID_WINDOW_MODE, DISPLAY_CHANGED_EVENT,
} from './android-display.constants';
import { createAndroidRates } from './create-android-rates';

const monitorOf = (info: NativeDisplayInfo): MonitorInfo => ({
  id: ANDROID_MONITOR_ID,
  label: ANDROID_MONITOR_LABEL,
  primary: true,
  width: info.width,
  height: info.height,
  scaleFactor: info.density > 0 ? info.density : 1,
  refreshHz: info.currentHz > 0 ? info.currentHz : null,
});

const createAndroidDisplayApi = (plugin: BrockDisplayPlugin): DisplayApi => {
  const rates = createAndroidRates(plugin);
  return {
    getRefreshRate: async () => {
      const info = await plugin.getDisplayInfo();
      return {
        reportedHz: info.currentHz > 0 ? info.currentHz : null,
        measuredHz: null,
        modes: info.supportedHz.map((hz) => ({ hz, sameResolution: true })),
      };
    },
    getSyncedRateStatus: rates.status,
    setSyncedRatePreference: rates.setPreference,
    applyRefreshRate: rates.apply,
    listMonitors: async () => [monitorOf(await plugin.getDisplayInfo())],
    getWindowMode: () => Promise.resolve(ANDROID_WINDOW_MODE),
    setWindowMode: () => Promise.resolve(ANDROID_WINDOW_MODE),
    onChanged: (listener) => listenNative(plugin, DISPLAY_CHANGED_EVENT, () => listener()),
  };
};

export { createAndroidDisplayApi };
