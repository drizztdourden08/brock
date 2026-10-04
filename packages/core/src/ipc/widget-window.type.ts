/* @layer core @kind types */
type WidgetPinMode = 'off' | 'top' | 'with-app';

type WidgetEdge = 'left' | 'right' | 'top' | 'bottom';

type WidgetDockBack = WidgetEdge | 'float' | 'close';

type WidgetWindowGroup = string;

type WindowGuideMode = 'moving' | 'resizing';

type WindowGroupAction = 'maximize' | 'fullscreen' | 'minimize' | 'restore';

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
  sync?: boolean;
  group?: WidgetWindowGroup | null;
}

interface WidgetWindowOpen extends Omit<PoppedWidgetWire, 'id'> {
  seq?: number;
  atCursor?: boolean;
  at?: WidgetWindowPoint;
  taskbar?: boolean;
}

interface WidgetWindowState {
  pin: WidgetPinMode;
  onTop: boolean;
  snap: boolean;
  link: WidgetSnapLink | null;
  sync: boolean;
  group: WidgetWindowGroup | null;
  square: boolean;
}

interface WindowGuideState {
  open: boolean;
  mode: WindowGuideMode;
  snapping: boolean;
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
  | { kind: 'areas' }
  | { kind: 'focusAway'; id: string }
  | { kind: 'resize'; id: string; bounds: WidgetWindowBounds }
  | { kind: 'group'; id: string; action: WindowGroupAction }
  | { kind: 'modifier'; ctrl: boolean }
  | { kind: 'guide'; id: string; mode: WindowGuideMode | null };

interface WidgetProbeFacts {
  visible: boolean;
  taskbar: boolean;
  sync: boolean;
  group: WidgetWindowGroup | null;
  square: boolean;
  backdrop: boolean;
  ctrl: boolean;
  guide: WindowGuideState;
  area: WidgetWindowBounds | null;
  windows: Record<string, WidgetWindowBounds>;
}

interface WidgetProbeResult {
  bounds: WidgetWindowBounds | null;
  link: WidgetSnapLink | null;
  counted: boolean;
  outside: string[];
  facts?: WidgetProbeFacts;
}

interface WidgetSlice {
  kind: string;
  data: unknown;
}

export type {
  PoppedWidgetWire, WidgetDockBack, WidgetEdge, WidgetFrameWire, WidgetPinMode, WidgetPrefsWire, WidgetProbeFacts, WidgetProbeRequest, WidgetProbeResult,
  WidgetSettingsWire, WidgetSlice, WidgetSnapLink, WidgetWindowBounds, WidgetWindowGroup, WidgetWindowInfo, WidgetWindowOpen, WidgetWindowPoint,
  WidgetWindowState, WindowGroupAction, WindowGuideMode, WindowGuideState,
};
