/* @layer tooling-scripts @kind types */
import type { ElectronApplication, Page } from 'playwright-core';

interface LaunchAppForTestOptions {
  appDir: string;
  args?: string[];
  env?: Record<string, string>;
  timeoutMs?: number;
}

interface LaunchedTestApp {
  app: ElectronApplication;
  page: Page;
  userData: string;
  close: () => Promise<void>;
}

interface TestRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DockLayoutReading {
  /** The layout as brock-react's store holds it: `{ v: 2, dock, floating, popped, frame, poppedMemory? }`. */
  layout: { v: 2; dock: unknown; floating: { id: string }[]; popped: { id: string }[]; frame: Record<string, unknown> };
  docked: string[];
  floating: string[];
  popped: string[];
  /** The main view's rect in the app window, in CSS pixels. */
  main: TestRect | null;
  /** The rect of each widget drawn in the app window, by id. */
  rects: Record<string, TestRect>;
}

interface WidgetWindowReading {
  id: string;
  bounds: TestRect;
  visible: boolean;
  focused: boolean;
  minimized: boolean;
  alwaysOnTop: boolean;
}

declare const launchAppForTest: (options: LaunchAppForTestOptions) => Promise<LaunchedTestApp>;
declare const assertLaunchable: (appDir: string) => string;
declare const unresolvableImports: (outDir: string) => { file: string; spec: string }[];
declare const readDockLayout: (page: Page, options?: { timeoutMs?: number }) => Promise<DockLayoutReading>;
declare const widgetWindows: (app: ElectronApplication) => Promise<WidgetWindowReading[]>;
declare const HEADLESS_ARGS: readonly string[];

export { launchAppForTest, assertLaunchable, unresolvableImports, readDockLayout, widgetWindows, HEADLESS_ARGS };
export type { DockLayoutReading, LaunchAppForTestOptions, LaunchedTestApp, TestRect, WidgetWindowReading };
