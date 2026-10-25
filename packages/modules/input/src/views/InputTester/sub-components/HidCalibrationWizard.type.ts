/* @layer renderer-shell @kind types */
import type { HidControllerMap } from './hid-calibration/hid-calibration.type';
import type { DeviceProfile } from '../../../device-profile';
import type { DeviceEntry } from '../../../device.type';

interface HidCalibrationWizardProps {
  onComplete: (map: HidControllerMap) => void;
  onCancel: () => void;
  deviceKey?: string;
  hideOwnActions?: boolean;
  onCapturedCountChange?: (count: number) => void;
  initialProfile?: DeviceProfile | null;
  capturedEntry?: DeviceEntry | null;
  initialProfileId?: string;
  initialHasGyro?: boolean;
}

interface HidWizardHandle {
  copyJson: () => Promise<boolean>;
  finish: () => void;
}

export type { HidCalibrationWizardProps, HidWizardHandle };
