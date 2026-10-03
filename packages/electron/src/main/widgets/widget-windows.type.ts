/* @layer electron-main @kind types */
import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import type { WidgetDockBack, WidgetEdge, WidgetPinMode, WidgetSnapLink, WidgetWindowBounds, WidgetWindowPoint } from '@drizztdourden08/brock-core';
import type { SecurityOptions } from '../types/main-context.type';

interface SnapTarget {
  to: string;
  bounds: WidgetWindowBounds;
}

interface Snapped {
  bounds: WidgetWindowBounds;
  link: WidgetSnapLink;
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
}

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

export type {
  BoundsReporter, CoverCandidate, MainSnapState, SnapCandidate, SnapTarget, Snapped, Span, StackPlace, WidgetWindowEntry, WidgetWindowSetup,
};
