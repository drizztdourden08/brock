/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';

const offScreenWindows = new WeakSet<BrowserWindow>();

export { offScreenWindows };
