/* @layer electron-main @kind types */
import type { BrowserWindow } from 'electron';

interface SplashOptions {
  version: string;
  size: { width: number; height: number };
  backgroundColor: string;
  pagePath: string;
}

interface SplashRef {
  current: BrowserWindow | null;
}

export type { SplashOptions, SplashRef };
