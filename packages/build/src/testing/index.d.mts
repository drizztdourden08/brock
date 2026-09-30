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

declare const launchAppForTest: (options: LaunchAppForTestOptions) => Promise<LaunchedTestApp>;
declare const assertLaunchable: (appDir: string) => string;
declare const unresolvableImports: (outDir: string) => { file: string; spec: string }[];
declare const HEADLESS_ARGS: readonly string[];

export { launchAppForTest, assertLaunchable, unresolvableImports, HEADLESS_ARGS };
export type { LaunchAppForTestOptions, LaunchedTestApp };
