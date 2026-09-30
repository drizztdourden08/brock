/* @layer electron-main @kind types */
import type { WindowPlan } from '../window/create-window.type';

interface SplashSetup {
  plan: WindowPlan;
  size: { width: number; height: number };
  title: string;
  version: string;
  backgroundColor: string;
  icon: string | undefined;
  pagePath: string;
  preloadPath: string;
}

export type { SplashSetup };
