/* @layer electron-main @kind types */
import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import type { WidgetDockBack, WidgetEdge, WidgetPinMode, WidgetSnapLink, WidgetWindowBounds, WidgetWindowGroup, WidgetWindowPoint } from '@drizztdourden08/brock-core';
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
  grab: WidgetWindowPoint | null;
  hiddenWithApp: boolean;
  parked: boolean;
  seq: number | undefined;
  closing: WidgetClosing | null;
  report: BoundsReporter;
  zStamp: number;
  over: boolean;
  faded: boolean;
  sync: boolean;
  group: WidgetWindowGroup | null;
  wantsTaskbar: boolean;
  taskbar: boolean;
  square: boolean;
}

type EntryFacts = Pick<WidgetWindowEntry, 'pin' | 'snap' | 'link' | 'seq' | 'sync' | 'group' | 'wantsTaskbar' | 'taskbar'>;

interface WidgetWindowSetup {
  headless: boolean;
  muted: boolean;
  title: string;
  renderer: string;
  base: BrowserWindowConstructorOptions;
  security?: SecurityOptions;
}

interface MainSnapState {
  grab: WidgetWindowPoint | null;
  hit: Snapped | null;
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
  start: WidgetWindowBounds;
  min: MinSize;
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
  xTargets: WidgetWindowBounds[];
  yTargets: WidgetWindowBounds[];
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

interface GroupMember {
  id: string;
  win: BrowserWindow;
  entry: WidgetWindowEntry | null;
}

type GroupMode = 'normal' | 'maximized' | 'fullscreen';

type GroupTarget = Exclude<GroupMode, 'normal'>;

interface GroupLayout {
  mode: GroupMode;
  saved: Map<string, WidgetWindowBounds>;
  onTop: Map<string, boolean>;
  backdrop: BrowserWindow | null;
  area: WidgetWindowBounds | null;
  release: (() => void) | null;
}

interface CaptureSheet {
  pixels: Buffer;
  width: number;
  height: number;
  scale: number;
  origin: WidgetWindowBounds;
}

export type {
  BoundsReporter, CaptureSheet, CoverCandidate, EdgeWindow, EntryFacts, GroupLayout, GroupMember, GroupMode, GroupTarget, MainSnapState, ManipulationRules,
  MinSize, ModifierInput, PackSpan, ResizeEdges, ResizeFollower, ResizeNeighbour, ResizeRequest, ResizeSession, ResizeStart, ResizeStep, SnapCandidate, SnapTarget, Snapped, Span, StackPlace, WidgetWindowEntry, WidgetWindowSetup, WillResizeCue,
};
