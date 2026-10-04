/* @layer electron-main @kind types */
import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import type { WidgetDockBack, WidgetEdge, WidgetPinMode, WidgetSnapLink, WidgetWindowBounds, WidgetWindowPoint } from '@drizztdourden08/brock-core';
import type { SecurityOptions } from '../types/main-context.type';
import type { AspectLock } from '../window/aspect-lock.type';

interface SnapTarget {
  to: string;
  bounds: WidgetWindowBounds;
}

interface Snapped {
  bounds: WidgetWindowBounds;
  link: WidgetSnapLink | null;
}

interface SnapCandidate {
  edge: WidgetEdge;
  distance: number;
  x: number;
  y: number;
}

interface Span {
  start: number;
  length: number;
}

interface CoverCandidate {
  bounds: WidgetWindowBounds;
  onTop: boolean;
  stamp: number;
}

interface StackPlace {
  onTop: boolean;
  stamp: number;
}

interface BoundsReporter {
  schedule: () => void;
  cancel: () => void;
  flush: () => boolean;
}

interface WidgetClosing {
  where?: WidgetDockBack;
}

interface WidgetWindowEntry {
  win: BrowserWindow;
  pin: WidgetPinMode;
  snap: boolean;
  link: WidgetSnapLink | null;
  last: WidgetWindowBounds;
  towed: boolean;
  hiddenWithApp: boolean;
  parked: boolean;
  seq: number | undefined;
  closing: WidgetClosing | null;
  report: BoundsReporter;
  zStamp: number;
  over: boolean;
  faded: boolean;
  sync: boolean;
  wantsTaskbar: boolean;
  taskbar: boolean;
  square: boolean;
}

type EntryFacts = Pick<WidgetWindowEntry, 'pin' | 'snap' | 'link' | 'seq' | 'sync' | 'wantsTaskbar' | 'taskbar'>;

interface WidgetWindowSetup {
  headless: boolean;
  muted: boolean;
  title: string;
  renderer: string;
  base: BrowserWindowConstructorOptions;
  security?: SecurityOptions;
}

interface MoveSession {
  id: string;
  members: Set<string>;
  hit: Snapped | null;
  grab: WidgetWindowPoint | null;
}

interface ResizeEdges {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

interface MinSize {
  width: number;
  height: number;
}

interface EdgeWindow {
  id: string;
  bounds: WidgetWindowBounds;
  min: MinSize;
}

interface EdgeMove {
  id: string;
  bounds: WidgetWindowBounds;
}

interface PackSpan {
  from: number;
  to: number;
  min: number;
}

interface ResizeNeighbour extends EdgeWindow {
  canFollow: boolean;
}

interface ResizeFollower {
  id: string;
  side: WidgetEdge;
  edge: WidgetEdge;
  start: WidgetWindowBounds;
  min: MinSize;
}

interface LineWindow {
  other: ResizeNeighbour;
  edge: WidgetEdge;
  far: boolean;
  span: Span;
}

interface ResizeStart {
  id: string;
  edge: string;
  sides: ResizeEdges;
  known: boolean;
  start: WidgetWindowBounds;
  first: WidgetWindowBounds;
  min: MinSize;
  locked: boolean;
  others: readonly ResizeNeighbour[];
}

interface ResizeSession extends Omit<ResizeStart, 'others'> {
  last: WidgetWindowBounds;
  followers: ResizeFollower[];
  around: EdgeMove[];
}

interface ResizeStep {
  bounds: WidgetWindowBounds;
  moves: EdgeMove[];
}

interface WillResizeCue {
  event: { preventDefault: () => void };
  proposed: WidgetWindowBounds;
  edge?: string;
}

interface ResizeRequest {
  proposed: WidgetWindowBounds;
  rules: ManipulationRules;
  lock: AspectLock;
}

interface ManipulationRules {
  snap: boolean;
  shared: boolean;
}

interface ModifierInput {
  type?: string;
  key?: string;
  keyCode?: string;
  control?: boolean;
  modifiers?: readonly string[];
}

interface ClusterMember {
  id: string;
  win: BrowserWindow;
  entry: WidgetWindowEntry | null;
}

type LayoutMode = 'normal' | 'maximized' | 'fullscreen';

type LayoutTarget = Exclude<LayoutMode, 'normal'>;

interface ClusterLayout {
  mode: LayoutMode;
  saved: Map<string, WidgetWindowBounds>;
  onTop: Map<string, boolean>;
  backdrop: BrowserWindow | null;
  area: WidgetWindowBounds | null;
  release: (() => void) | null;
}

interface PathStep {
  id: string;
  entry: WidgetWindowEntry;
  link: WidgetSnapLink | null;
}

interface CaptureSheet {
  pixels: Buffer;
  width: number;
  height: number;
  scale: number;
  origin: WidgetWindowBounds;
}

export type {
  BoundsReporter, CaptureSheet, ClusterLayout, ClusterMember, CoverCandidate, EdgeMove, EdgeWindow, EntryFacts, LayoutMode, LayoutTarget, LineWindow, ManipulationRules,
  MinSize, MoveSession, ModifierInput, PackSpan, PathStep, ResizeEdges, ResizeFollower, ResizeNeighbour, ResizeRequest, ResizeSession, ResizeStart, ResizeStep, SnapCandidate, SnapTarget, Snapped, Span, StackPlace, WidgetWindowEntry, WidgetWindowSetup, WillResizeCue,
};
