/* @layer renderer-components @kind hook */
import { useCallback, useMemo } from 'react';
import { useCalibrationStore } from '../../../renderer/useCalibrationStore';
import type { DeviceStickCalibration, TriggerCalibration } from '../../../calibration.type';
import { controllerInputStore } from '../../../controller-input/controller-input-store';
import type { ControllerCalibration } from '../ControllerPage.type';

const useControllerCalibration = (deviceKey: string): ControllerCalibration => {
  const existingStickCal = useCalibrationStore((s) => s.sticks[deviceKey] ?? null);
  const saveStick = useCalibrationStore((s) => s.saveStick);
  const saveTrigger = useCalibrationStore((s) => s.saveTrigger);

  const onStickComplete = useCallback((calibration: DeviceStickCalibration) => {
    controllerInputStore.log(`Stick calibration loaded for ${deviceKey}`);
    void saveStick(deviceKey, calibration);
  }, [deviceKey, saveStick]);

  const onTriggerComplete = useCallback((axisIndex: number, calibration: TriggerCalibration) => {
    controllerInputStore.log(`Trigger calibration loaded for ${deviceKey} axis ${axisIndex}`);
    void saveTrigger(deviceKey, axisIndex, calibration);
  }, [deviceKey, saveTrigger]);

  return useMemo(
    () => ({ existingStickCal, onStickComplete, onTriggerComplete }),
    [existingStickCal, onStickComplete, onTriggerComplete],
  );
};

export { useControllerCalibration };
