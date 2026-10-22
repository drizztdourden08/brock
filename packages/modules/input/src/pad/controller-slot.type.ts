/* @layer core @kind types */
import type { ControllerExtra, ControllerSlotId, ControllerSlotState } from '@drizztdourden08/tessera';

type PadSlotState = Pick<ControllerSlotState, 'pressed' | 'value' | 'x' | 'y'>;

type PadSlots = Partial<Record<ControllerSlotId, PadSlotState>>;

type PadExtra = Omit<ControllerExtra, 'glyph'>;

interface PadState {
  slots: PadSlots;
  extras: PadExtra[];
}

type PadFamily = 'xbox' | 'playstation' | 'nintendo' | 'generic';

interface PadDevice {
  family?: PadFamily;
  hasButton?: readonly boolean[];
}

type PadStateListener = (deviceKey: string, state: PadState) => void;

export type { ControllerSlotId, ControllerSlotState, PadSlotState, PadSlots, PadExtra, PadState, PadFamily, PadDevice, PadStateListener };
