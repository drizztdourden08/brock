/* @layer renderer-shell @kind types */
import type { PressedGridItem } from '../../compounds/PressedGrid';
import type { DeviceEntry, VibrateSegment } from '../../device.type';
import type { StickPoint } from '../../calibration.type';
import type { StickSlot, TriggerSlot } from '../axis-slot.type';
import type { DeviceCardAction } from '../device-card-action.type';

interface DeviceCardProps {
  entry: DeviceEntry;
  actions?: readonly DeviceCardAction[];
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

interface ButtonReading {
  items: PressedGridItem[];
  pressed: string[];
}

export type { ButtonReading, DeviceCardProps, RumblePreset, CalibrationTarget, StickReading, TriggerReading };
