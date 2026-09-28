/* @layer renderer-shell @kind logic */
import type { DeviceStickCalibration } from '../../../calibration.type';
import { applyStickCalibration } from '../../../calibration/apply-stick-calibration';
import { STICK_SLOTS } from '../DeviceCard.constants';
import type { StickReading } from '../DeviceCard.type';

const readSticks = (axes: readonly number[], calibration: DeviceStickCalibration | null): StickReading[] =>
  STICK_SLOTS.map((slot) => {
    const x = axes[slot.xAxis] ?? 0;
    const y = axes[slot.yAxis] ?? 0;
    const sideCalibration = calibration?.[slot.side];
    const point = sideCalibration ? applyStickCalibration(x, y, sideCalibration) : { x, y };
    return { ...slot, point, calibrated: sideCalibration !== undefined };
  });

export { readSticks };
