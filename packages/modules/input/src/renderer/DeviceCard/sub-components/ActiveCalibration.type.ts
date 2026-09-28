/* @layer renderer-shell @kind types */
import type { DeviceStickCalibration } from '../../../calibration.type';
import type { CalibrationTarget } from '../DeviceCard.type';

interface ActiveCalibrationProps {
  deviceKey: string;
  target: CalibrationTarget;
  existing: DeviceStickCalibration | null;
  onClose: () => void;
}

export type { ActiveCalibrationProps };
