/* @layer renderer-shell @kind types */
import type { DeviceEntry, VibrateSegment } from '../../device.type';
import type { StickPoint } from '../../calibration.type';
import type { StickSlot, TriggerSlot } from '../axis-slot.type';

interface DeviceCardProps {
  entry: DeviceEntry;
}

interface RumblePreset {
  key: string;
  label: string;
  pattern: VibrateSegment[];
  gapMs: number;
}

type CalibrationTarget = { kind: 'stick'; slot: StickSlot } | { kind: 'trigger'; slot: TriggerSlot } | null;

interface StickReading extends StickSlot {
  point: StickPoint;
  calibrated: boolean;
}

interface TriggerReading extends TriggerSlot {
  value: number;
  calibrated: boolean;
}

export type { DeviceCardProps, RumblePreset, CalibrationTarget, StickReading, TriggerReading };
