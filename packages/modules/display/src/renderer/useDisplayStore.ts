/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { UNSUPPORTED_SYNCED_RATE } from '../display.constants';
import { displayApi } from './display-api';
import { SWITCH_SETTLE_MS } from './refresh-rate.constants';
import type { DisplayState } from './display-store.type';
import { useRefreshRateStore } from './useRefreshRateStore';

const settle = (): Promise<void> => new Promise((resolve) => { setTimeout(resolve, SWITCH_SETTLE_MS); });

const useDisplayStore = create<DisplayState>()((set) => ({
  status: UNSUPPORTED_SYNCED_RATE,
  monitors: [],
  windowMode: null,
  applying: false,

  refresh: async () => {
    const api = displayApi();
    if (!api) return;
    const [status, monitors, windowMode] = await Promise.all([api.getSyncedRateStatus(), api.listMonitors(), api.getWindowMode()]);
    set({ status, monitors, windowMode });
  },

  setSyncedPreference: async (enabled, targetHz) => {
    const api = displayApi();
    if (!api) return;
    set({ status: await api.setSyncedRatePreference(enabled, targetHz) });
  },

  applyRate: async (hz) => {
    const api = displayApi();
    if (!api) return;
    set({ applying: true });
    try {
      set({ status: await api.applyRefreshRate(hz) });
      await settle();
      await useRefreshRateStore.getState().refresh();
    } finally {
      set({ applying: false });
    }
  },

  setWindowMode: async (mode, monitorId) => {
    const api = displayApi();
    if (!api) return;
    set({ windowMode: await api.setWindowMode(mode, monitorId) });
  },
}));

export { useDisplayStore };
