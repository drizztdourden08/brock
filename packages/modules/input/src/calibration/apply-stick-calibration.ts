/* @layer core @kind logic */
import type { StickCalibration, StickPoint } from '../calibration.type';

const normalizeAxis = (raw: number, center: number, min: number, max: number): number => {
  if (raw < center) return -(center - raw) / (center - min || 1);
  return (raw - center) / (max - center || 1);
};

const applyStickCalibration = (rawX: number, rawY: number, calibration: StickCalibration): StickPoint => {
  const { centerX, centerY, minX, maxX, minY, maxY, innerDeadzone, outerDeadzone } = calibration;
  const nx = normalizeAxis(rawX, centerX, minX, maxX);
  const ny = normalizeAxis(rawY, centerY, minY, maxY);
  const magnitude = Math.min(Math.hypot(nx, ny), 1);
  if (magnitude < innerDeadzone || magnitude === 0) return { x: 0, y: 0 };
  const unit = Math.hypot(nx, ny);
  const rescaled = Math.min((magnitude - innerDeadzone) / (outerDeadzone - innerDeadzone), 1);
  return { x: (nx / unit) * rescaled, y: (ny / unit) * rescaled };
};

export { applyStickCalibration };
