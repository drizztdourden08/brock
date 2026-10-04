/* @layer renderer-shell @kind types */
import type { WidgetPinMode, WidgetWindowGroup } from '@drizztdourden08/brock-core';
import type { WidgetFrame } from '@drizztdourden08/tessera/composites';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { WidgetDef } from '../widget.type';

interface WidgetWindowProps {
  id: string;
  widgets?: readonly WidgetDef[];
}

interface PoppedWindowControls {
  pin: WidgetPinMode;
  snap: boolean;
  sync: boolean;
  group: WidgetWindowGroup | null;
  setPin: (mode: WidgetPinMode) => void;
  setSnap: (on: boolean) => void;
  setSync: (on: boolean) => void;
  setGroup: (group: WidgetWindowGroup | null) => void;
}

interface WidgetWindowOptionsProps {
  id: string;
  definition: WidgetDef | undefined;
  anchor: HTMLElement;
  frame: WidgetFrame;
  own: PoppedWindowControls;
  onClose: () => void;
}

interface PinChoice {
  value: WidgetPinMode;
  label: string;
  short: string;
  hint: string;
  icon: IconName;
}

interface PinControlProps {
  pin: WidgetPinMode;
  onPinChange: (mode: WidgetPinMode) => void;
}

interface WidgetPinMenuProps extends PinControlProps {
  host: HTMLElement;
}

export type { PinChoice, PinControlProps, WidgetPinMenuProps, WidgetWindowOptionsProps, WidgetWindowProps };
