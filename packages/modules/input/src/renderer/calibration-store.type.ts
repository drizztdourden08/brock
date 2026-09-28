/* @layer renderer-shell @kind types */
import type {
  DeviceStickCalibration, StickCalibrationStore, TriggerCalibration, TriggerCalibrationStore,
} from '../calibration.type';

interface CalibrationState {
  sticks: StickCalibrationStore;
  triggers: TriggerCalibrationStore;
  loaded: boolean;
  refresh: () => Promise<void>;
  saveStick: (deviceKey: string, calibration: DeviceStickCalibration) => Promise<void>;
  saveTrigger: (deviceKey: string, axisIndex: number, calibration: TriggerCalibration) => Promise<void>;
}

export type { CalibrationState };
