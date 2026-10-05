/* @layer core @kind types */
type WidgetPinMode = 'off' | 'top';

type StoredPinMode = WidgetPinMode | 'with-app';

type WidgetEdge = 'left' | 'right' | 'top' | 'bottom';

type WidgetDockBack = WidgetEdge | 'float' | 'close';

type WindowGuideMode = 'moving' | 'resizing';

type WindowClusterAction = 'maximize' | 'fullscreen' | 'minimize' | 'restore';

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
  pin?: StoredPinMode;
  snap?: boolean;
  link?: WidgetSnapLink | null;
  sync?: boolean;
}

type PoppedWidgetPatch = Partial<Omit<PoppedWidgetWire, 'id' | 'pin'>> & { pin?: WidgetPinMode };

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
  square: boolean;
}

interface WindowGuideState {
  open: boolean;
  mode: WindowGuideMode;
  snapping: boolean;
  pointer?: WidgetWindowPoint | null;
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
  | { kind: 'drag'; id: string; bounds: WidgetWindowBounds; alone?: boolean }
  | { kind: 'main'; bounds?: WidgetWindowBounds }
  | { kind: 'mainDrag'; bounds: WidgetWindowBounds; alone?: boolean }
  | { kind: 'dragOver'; id: string; point: WidgetWindowPoint | null }
  | { kind: 'drop'; id: string; point: WidgetWindowPoint }
  | { kind: 'rescue'; id: string; bounds: WidgetWindowBounds }
  | { kind: 'areas' }
  | { kind: 'focusAway'; id: string }
  | { kind: 'resize'; id: string; bounds: WidgetWindowBounds }
  | { kind: 'cluster'; id: string; action: WindowClusterAction; area?: WidgetWindowBounds }
  | { kind: 'modifier'; ctrl: boolean }
  | { kind: 'mouse'; id: string; action: 'down' | 'move' | 'up'; point: WidgetWindowPoint }
  | { kind: 'guide'; id: string; mode: WindowGuideMode | null; pointer?: WidgetWindowPoint }
  | { kind: 'tourSpot'; id: string }
  | { kind: 'click'; id: string; selector: string };

interface WidgetProbeFacts {
  visible: boolean;
  taskbar: boolean;
  sync: boolean;
  cluster: string[];
  square: boolean;
  backdrop: boolean;
  ctrl: boolean;
  guide: WindowGuideState;
  guideIn: string | null;
  guideDrawn: string[];
  guideBeside: string[];
  area: WidgetWindowBounds | null;
  windows: Record<string, WidgetWindowBounds>;
  tourLit?: boolean;
  clicked?: boolean;
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
  PoppedWidgetPatch, PoppedWidgetWire, StoredPinMode, WidgetDockBack, WidgetEdge, WidgetFrameWire, WidgetPinMode, WidgetPrefsWire, WidgetProbeFacts, WidgetProbeRequest, WidgetProbeResult,
  WidgetSettingsWire, WidgetSlice, WidgetSnapLink, WidgetWindowBounds, WidgetWindowInfo, WidgetWindowOpen, WidgetWindowPoint,
  WidgetWindowState, WindowClusterAction, WindowGuideMode, WindowGuideState,
};
