/* @layer core @kind constants */
import type { StickCalibration } from '../calibration.type';

const DEFAULT_INNER_DEADZONE = 0.1;
const DEFAULT_OUTER_DEADZONE = 0.95;
const DEFAULT_TRIGGER_DEADZONE = 0.05;

const IDENTITY_STICK: StickCalibration = {
  centerX: 0,
  centerY: 0,
  minX: -1,
  maxX: 1,
  minY: -1,
  maxY: 1,
  innerDeadzone: DEFAULT_INNER_DEADZONE,
  outerDeadzone: DEFAULT_OUTER_DEADZONE,
};

export { DEFAULT_INNER_DEADZONE, DEFAULT_OUTER_DEADZONE, DEFAULT_TRIGGER_DEADZONE, IDENTITY_STICK };
