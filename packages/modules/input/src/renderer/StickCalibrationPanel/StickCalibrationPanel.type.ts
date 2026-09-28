/* @layer renderer-shell @kind types */
import type { DeviceStickCalibration, StickPoint, StickSide } from '../../calibration.type';
import type { StickSlot } from '../axis-slot.type';

interface StickCalibrationPanelProps {
  deviceKey: string;
  slot: StickSlot;
  existing: DeviceStickCalibration | null;
  onClose: () => void;
}

type StickStep = 'center' | 'range' | 'review';

interface StickRange {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface StickBuildInput {
  side: StickSide;
  existing: DeviceStickCalibration | null;
  center: StickPoint;
  range: StickRange;
  innerDeadzone: number;
  outerDeadzone: number;
}

export type { StickCalibrationPanelProps, StickStep, StickRange, StickBuildInput };
