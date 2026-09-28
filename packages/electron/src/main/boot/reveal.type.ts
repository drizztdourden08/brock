/* @layer electron-main @kind types */
import type { BrowserWindow } from 'electron';

interface RevealState {
  target: BrowserWindow | null;
  watchdog: NodeJS.Timeout | null;
  revealed: boolean;
}

export type { RevealState };
