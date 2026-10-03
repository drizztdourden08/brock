/* @layer renderer-shell @kind types */
import type { CalibrationButtons } from '../../compounds/CalibrationPanel';
import type { TriggerSlot } from '../axis-slot.type';

interface TriggerCalibrationPanelProps {
  deviceKey: string;
  slot: TriggerSlot;
  buttons?: CalibrationButtons;
  onClose: () => void;
}

type TriggerStep = 'rest' | 'press' | 'review';

export type { TriggerCalibrationPanelProps, TriggerStep };
