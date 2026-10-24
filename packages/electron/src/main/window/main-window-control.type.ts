/* @layer electron-main @kind types */
import type { BrowserWindow } from 'electron';

interface MainWindowControl {
  (): BrowserWindow | null;
  show: () => Promise<void>;
}

export type { MainWindowControl };
