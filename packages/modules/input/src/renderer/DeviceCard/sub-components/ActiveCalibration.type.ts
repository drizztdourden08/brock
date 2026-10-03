/* @layer renderer-shell @kind types */
import type { InputIconFamily } from '@drizztdourden08/tessera/primitives';
import type { DeviceStickCalibration } from '../../../calibration.type';
import type { CalibrationButtons } from '../../../compounds/CalibrationPanel';
import type { CalibrationTarget } from '../DeviceCard.type';

interface ActiveCalibrationProps {
  deviceKey: string;
  target: CalibrationTarget;
  existing: DeviceStickCalibration | null;
  buttons: CalibrationButtons;
  family?: InputIconFamily;
  onClose: () => void;
}

export type { ActiveCalibrationProps };
