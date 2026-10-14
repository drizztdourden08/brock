/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { ControllerDevicesStore } from './controller-devices-store.type';
import { inputApi } from './input-api';
import { RESCAN_TIMEOUT_MS } from './input-renderer.constants';
import { isInputAvailable } from './is-input-available';

let unsubscribeDevices: (() => void) | null = null;

const useControllerDevicesStore = create<ControllerDevicesStore>()((set) => {
  const listen = (): void => {
    if (unsubscribeDevices || !isInputAvailable()) return;
    unsubscribeDevices = inputApi().onDevices((entries) => set({ entries, rescanPending: false }));
  };

  return {
    entries: [],
    status: { available: false, sdlVersion: null },
    loaded: false,
    rescanPending: false,

    refresh: async () => {
      const api = inputApi();
      listen();
      const [status, entries] = await Promise.all([api.status(), api.list()]);
      set({ status, entries, loaded: true });
    },

    rescan: async () => {
      if (!isInputAvailable()) return;
      set({ rescanPending: true });
      setTimeout(() => set({ rescanPending: false }), RESCAN_TIMEOUT_MS);
      await inputApi().rescan();
    },

    addMapping: (mapping) => inputApi().mapping.add(mapping),
  };
});

export { useControllerDevicesStore };
