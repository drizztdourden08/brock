/* @layer renderer-shell @kind logic */
import type { DeviceStickCalibration, StickCalibration } from '../../../calibration.type';
import { IDENTITY_STICK } from '../../../calibration/calibration.constants';
import type { StickBuildInput } from '../StickCalibrationPanel.type';

const buildStickCalibration = (input: StickBuildInput): DeviceStickCalibration => {
  const { side, existing, center, range, innerDeadzone, outerDeadzone } = input;
  const measured: StickCalibration = { centerX: center.x, centerY: center.y, ...range, innerDeadzone, outerDeadzone };
  const base = { left: existing?.left ?? IDENTITY_STICK, right: existing?.right ?? IDENTITY_STICK };
  return { ...base, [side]: measured, updatedAt: new Date().toISOString() };
};

export { buildStickCalibration };
