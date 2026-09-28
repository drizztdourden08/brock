/* @layer core @kind types */
interface StickCalibration {
  centerX: number;
  centerY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  innerDeadzone: number;
  outerDeadzone: number;
}

interface DeviceStickCalibration {
  left: StickCalibration;
  right: StickCalibration;
  updatedAt: string;
}

interface TriggerCalibration {
  base: number;
  max: number;
  deadzone: number;
}

type StickCalibrationStore = Record<string, DeviceStickCalibration>;

type TriggerCalibrationStore = Record<string, TriggerCalibration>;

interface StickPoint {
  x: number;
  y: number;
}

type StickSide = 'left' | 'right';

export type {
  StickCalibration, DeviceStickCalibration, TriggerCalibration, StickCalibrationStore, TriggerCalibrationStore,
  StickPoint, StickSide,
};
