/* @layer core @kind types */
type WidgetPinMode = 'off' | 'top' | 'with-app';

type WidgetEdge = 'left' | 'right' | 'top' | 'bottom';

type WidgetDockBack = WidgetEdge | 'float' | 'close';

interface WidgetWindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WidgetWindowPoint {
  x: number;
  y: number;
}

interface WidgetSnapLink {
  to: string;
  edge: WidgetEdge;
}

interface PoppedWidgetWire {
  id: string;
  bounds?: WidgetWindowBounds;
  pin?: WidgetPinMode;
  snap?: boolean;
  link?: WidgetSnapLink | null;
}

type WidgetWindowOpen = Omit<PoppedWidgetWire, 'id'>;

interface WidgetWindowState {
  pin: WidgetPinMode;
  onTop: boolean;
  snap: boolean;
  link: WidgetSnapLink | null;
}

interface WidgetWindowInfo {
  id: string;
  focused: boolean;
  visible: boolean;
}

interface WidgetFrameWire {
  opacity: number;
  show: 'always' | 'context-only';
}

interface WidgetSlice {
  kind: string;
  data: unknown;
}

export type {
  PoppedWidgetWire, WidgetDockBack, WidgetEdge, WidgetFrameWire, WidgetPinMode, WidgetSlice, WidgetSnapLink, WidgetWindowBounds,
  WidgetWindowInfo, WidgetWindowOpen, WidgetWindowPoint, WidgetWindowState,
};
