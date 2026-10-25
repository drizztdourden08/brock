/* @layer core @kind types */
import type { ReactNode } from 'react';
import type { CONTROLLER_SLOT_IDS } from './controller-slot-ids.constants';

type ControllerSlotId = (typeof CONTROLLER_SLOT_IDS)[number];

interface ControllerSlotState {
  pressed?: boolean;
  value?: number;
  x?: number;
  y?: number;
  label?: string;
  glyph?: ReactNode;
}

interface ControllerExtra {
  id: string;
  label: string;
  glyph?: ReactNode;
  pressed?: boolean;
  value?: number;
}

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

export type {
  ControllerExtra, ControllerSlotId, ControllerSlotState, PadSlotState, PadSlots, PadExtra, PadState, PadFamily, PadDevice, PadStateListener,
};
