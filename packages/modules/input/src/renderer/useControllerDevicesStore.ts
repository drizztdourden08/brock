/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { ControllerDevicesStore } from './controller-devices-store.type';
import { inputApi } from './input-api';
import { RESCAN_TIMEOUT_MS } from './input-renderer.constants';

let unsubscribeDevices: (() => void) | null = null;

const useControllerDevicesStore = create<ControllerDevicesStore>()((set) => {
  const listen = (): void => {
    if (unsubscribeDevices) return;
    unsubscribeDevices = inputApi()?.onDevices((entries) => set({ entries, rescanPending: false })) ?? null;
  };

  return {
    entries: [],
    status: { available: false, sdlVersion: null },
    loaded: false,
    rescanPending: false,

    refresh: async () => {
      const api = inputApi();
      if (!api) {
        set({ loaded: true });
        return;
      }
      listen();
      const [status, entries] = await Promise.all([api.status(), api.list()]);
      set({ status, entries, loaded: true });
    },

    rescan: async () => {
      const api = inputApi();
      if (!api) return;
      set({ rescanPending: true });
      setTimeout(() => set({ rescanPending: false }), RESCAN_TIMEOUT_MS);
      await api.rescan();
    },

    addMapping: async (mapping) => (await inputApi()?.mapping.add(mapping)) ?? false,
  };
});

export { useControllerDevicesStore };
