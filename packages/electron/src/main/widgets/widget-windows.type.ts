/* @layer electron-main @kind types */
import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import type { WidgetEdge, WidgetPinMode, WidgetSnapLink, WidgetWindowBounds, WidgetWindowPoint } from '@drizztdourden08/brock-core';
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

interface WidgetWindowEntry {
  win: BrowserWindow;
  pin: WidgetPinMode;
  snap: boolean;
  link: WidgetSnapLink | null;
  last: WidgetWindowBounds;
  towed: boolean;
  grab: WidgetWindowPoint | null;
  hiddenWithApp: boolean;
}

interface WidgetWindowSetup {
  headless: boolean;
  muted: boolean;
  title: string;
  renderer: string;
  base: BrowserWindowConstructorOptions;
  security?: SecurityOptions;
}

export type { SnapCandidate, SnapTarget, Snapped, WidgetWindowEntry, WidgetWindowSetup };
