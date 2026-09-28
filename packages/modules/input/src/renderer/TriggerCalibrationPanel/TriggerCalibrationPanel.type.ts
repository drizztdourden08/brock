/* @layer renderer-shell @kind types */
import type { TriggerSlot } from '../axis-slot.type';

interface TriggerCalibrationPanelProps {
  deviceKey: string;
  slot: TriggerSlot;
  onClose: () => void;
}

type TriggerStep = 'rest' | 'press' | 'review';

export type { TriggerCalibrationPanelProps, TriggerStep };
