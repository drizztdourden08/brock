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

interface WidgetWindowOpen extends Omit<PoppedWidgetWire, 'id'> {
  seq?: number;
  atCursor?: boolean;
  taskbar?: boolean;
}

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

type WidgetPrefsWire = Record<string, unknown>;

type WidgetSettingsWire = Record<string, unknown>;

type WidgetProbeRequest =
  | { kind: 'window'; id: string }
  | { kind: 'drag'; id: string; bounds: WidgetWindowBounds }
  | { kind: 'main'; bounds?: WidgetWindowBounds }
  | { kind: 'mainDrag'; bounds: WidgetWindowBounds }
  | { kind: 'dragOver'; id: string; point: WidgetWindowPoint | null }
  | { kind: 'drop'; id: string; point: WidgetWindowPoint }
  | { kind: 'rescue'; id: string; bounds: WidgetWindowBounds }
  | { kind: 'areas' };

interface WidgetProbeResult {
  bounds: WidgetWindowBounds | null;
  link: WidgetSnapLink | null;
  counted: boolean;
  outside: string[];
}

interface WidgetSlice {
  kind: string;
  data: unknown;
}

export type {
  PoppedWidgetWire, WidgetDockBack, WidgetEdge, WidgetFrameWire, WidgetPinMode, WidgetPrefsWire, WidgetProbeRequest, WidgetProbeResult, WidgetSettingsWire,
  WidgetSlice, WidgetSnapLink, WidgetWindowBounds, WidgetWindowInfo, WidgetWindowOpen, WidgetWindowPoint, WidgetWindowState,
};
