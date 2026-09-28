/* @layer electron-main @kind logic */
import { readJson, writeJson } from '@drizztdourden08/brock-core/storage';
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type {
  DeviceStickCalibration, StickCalibrationStore, TriggerCalibration, TriggerCalibrationStore,
} from '../calibration.type';
import type { CalibrationStore } from './calibration-store.type';
import { STICK_FILE, TRIGGER_FILE } from './calibration-store.constants';

const createCalibrationStore = (files: FileStore): CalibrationStore => {
  const readSticks = (): Promise<StickCalibrationStore> => readJson<StickCalibrationStore>(files, STICK_FILE, {});

  const readTriggers = (): Promise<TriggerCalibrationStore> =>
    readJson<TriggerCalibrationStore>(files, TRIGGER_FILE, {});

  const writeStick = async (deviceKey: string, calibration: DeviceStickCalibration): Promise<void> => {
    const store = await readSticks();
    await writeJson(files, STICK_FILE, { ...store, [deviceKey]: calibration }, { trailingNewline: true });
  };

  const writeTrigger = async (deviceKey: string, axisIndex: number, calibration: TriggerCalibration): Promise<void> => {
    const store = await readTriggers();
    await writeJson(files, TRIGGER_FILE, { ...store, [`${deviceKey}:${axisIndex}`]: calibration }, { trailingNewline: true });
  };

  return { readSticks, writeStick, readTriggers, writeTrigger };
};

export { createCalibrationStore };
