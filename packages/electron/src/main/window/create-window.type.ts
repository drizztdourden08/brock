/* @layer electron-main @kind types */
import type { WindowState } from './window-state.type';
import type { StartupConfig } from './startup-config.type';

interface WindowPlan {
  headless: boolean;
  startup: StartupConfig;
  saved: WindowState;
  title: string;
}

export type { WindowPlan };
