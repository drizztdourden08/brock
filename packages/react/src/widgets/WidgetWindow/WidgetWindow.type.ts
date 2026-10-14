/* @layer renderer-shell @kind types */
import type { WidgetPinMode } from '@drizztdourden08/brock-core';
import type { WidgetFrame, WidgetProps } from '@drizztdourden08/tessera/composites';
import type { WidgetDisabledHook } from '../WidgetHost/WidgetHost.type';
import type { WidgetDef } from '../widget.type';

interface WidgetWindowProps {
  id: string;
  widgets?: readonly WidgetDef[];
  widgetDisabled?: WidgetDisabledHook;
}

type PoppedDisabled = Pick<WidgetProps, 'disabled' | 'onOpenSettings'>;

interface PoppedWindowControls {
  pin: WidgetPinMode;
  snap: boolean;
  sync: boolean;
  setPin: (mode: WidgetPinMode) => void;
  setSnap: (on: boolean) => void;
  setSync: (on: boolean) => void;
}

interface WidgetWindowOptionsProps {
  id: string;
  definition: WidgetDef | undefined;
  frame: WidgetFrame;
  own: PoppedWindowControls;
  defaultOpen: boolean;
}

interface WidgetTourSpotProps {
  id: string;
}

interface ReviewOptionsRequest {
  id: string;
  open: boolean;
}

export type { PoppedDisabled, ReviewOptionsRequest, WidgetTourSpotProps, WidgetWindowOptionsProps, WidgetWindowProps };
