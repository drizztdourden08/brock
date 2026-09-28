/* @layer renderer-shell @kind logic */
import type { TriggerCalibrationStore } from '../../../calibration.type';
import { applyTriggerCalibration } from '../../../calibration/apply-trigger-calibration';
import { TRIGGER_SLOTS } from '../DeviceCard.constants';
import type { TriggerReading } from '../DeviceCard.type';

const readTriggers = (deviceKey: string, axes: readonly number[], store: TriggerCalibrationStore): TriggerReading[] =>
  TRIGGER_SLOTS.map((slot) => {
    const raw = axes[slot.axisIndex] ?? 0;
    const calibration = store[`${deviceKey}:${slot.axisIndex}`];
    const value = calibration ? applyTriggerCalibration(raw, calibration) : raw;
    return { ...slot, value, calibrated: calibration !== undefined };
  });

export { readTriggers };
