/* @layer renderer-shell @kind types */
import type { WidgetPinMode, WidgetWindowGroup } from '@drizztdourden08/brock-core';
import type { WidgetFrame } from '@drizztdourden08/tessera/composites';
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

export type { WidgetWindowOptionsProps, WidgetWindowProps };
