/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { CalibrationState } from './calibration-store.type';
import { inputApi } from './input-api';

const useCalibrationStore = create<CalibrationState>()((set) => ({
  sticks: {},
  triggers: {},
  loaded: false,

  refresh: async () => {
    const api = inputApi();
    if (!api) {
      set({ loaded: true });
      return;
    }
    const [sticks, triggers] = await Promise.all([api.calibration.readSticks(), api.calibration.readTriggers()]);
    set({ sticks, triggers, loaded: true });
  },

  saveStick: async (deviceKey, calibration) => {
    await inputApi()?.calibration.writeStick(deviceKey, calibration);
    set((s) => ({ sticks: { ...s.sticks, [deviceKey]: calibration } }));
  },

  saveTrigger: async (deviceKey, axisIndex, calibration) => {
    await inputApi()?.calibration.writeTrigger(deviceKey, axisIndex, calibration);
    set((s) => ({ triggers: { ...s.triggers, [`${deviceKey}:${axisIndex}`]: calibration } }));
  },
}));

export { useCalibrationStore };
