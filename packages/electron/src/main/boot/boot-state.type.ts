/* @layer electron-main @kind types */
import type { BrowserWindow } from 'electron';
import type { BootFailure, BootProgress, BootTaskContext, BootTask, BootTaskDef, BootTimeline } from '@drizztdourden08/brock-core/boot';
import type { MainContext } from '../types/main-context.type';

type BootSide = 'main' | 'renderer';

type FailLoadArgs = [event: Electron.Event, code: number, description: string, url: string, isMainFrame: boolean];

interface BootFailureRecord extends BootFailure {
  side: BootSide;
}

interface BootState {
  splash: BrowserWindow | null;
  app: BrowserWindow | null;
  headless: boolean;
  main: BootProgress | null;
  renderer: BootProgress | null;
  lastSide: BootSide;
  shownFraction: number;
  mainDone: boolean;
  rendererReady: boolean;
  failure: BootFailureRecord | null;
  revealing: boolean;
  revealed: boolean;
  present: (() => void) | null;
  watchdog: NodeJS.Timeout | null;
  watchdogMs: number;
  holds: Promise<unknown>[];
  timeline: BootTimeline;
}

interface BootEventMap {
  progress: [side: BootSide];
  revealed: [];
  failed: [failure: BootFailureRecord];
  window: [win: BrowserWindow];
}

type MainBootContext = BootTaskContext<MainContext>;
type MainBootTaskDef = BootTaskDef<MainContext>;
type MainBootTask = BootTask<MainContext>;

export type { BootEventMap, BootFailureRecord, BootSide, FailLoadArgs, BootState, MainBootContext, MainBootTask, MainBootTaskDef };
