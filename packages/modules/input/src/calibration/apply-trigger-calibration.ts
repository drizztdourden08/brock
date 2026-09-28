/* @layer core @kind logic */
import type { TriggerCalibration } from '../calibration.type';

const applyTriggerCalibration = (raw: number, calibration: TriggerCalibration): number => {
  const { base, max, deadzone } = calibration;
  const range = max - base;
  if (range <= 0) return 0;
  const normalized = Math.max(0, Math.min(1, (raw - base) / range));
  return normalized < deadzone ? 0 : (normalized - deadzone) / (1 - deadzone);
};

export { applyTriggerCalibration };
