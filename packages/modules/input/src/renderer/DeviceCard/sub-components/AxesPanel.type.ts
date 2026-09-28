/* @layer renderer-shell @kind types */
import type { CalibrationTarget, StickReading, TriggerReading } from '../DeviceCard.type';

interface AxesPanelProps {
  sticks: readonly StickReading[];
  triggers: readonly TriggerReading[];
  hasAxis: readonly boolean[];
  onCalibrate: (target: CalibrationTarget) => void;
}

export type { AxesPanelProps };
