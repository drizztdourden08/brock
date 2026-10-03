/* @layer renderer-shell @kind types */
import type { InputIconFamily } from '@drizztdourden08/tessera/primitives';
import type { CalibrationButtons } from '../../compounds/CalibrationPanel';
import type { TriggerSlot } from '../axis-slot.type';

interface TriggerCalibrationPanelProps {
  deviceKey: string;
  slot: TriggerSlot;
  buttons?: CalibrationButtons;
  family?: InputIconFamily;
  onClose: () => void;
}

type TriggerStep = 'rest' | 'press' | 'review';

export type { TriggerCalibrationPanelProps, TriggerStep };
