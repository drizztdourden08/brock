/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow } from 'electron';

const windowScale = (win: BrowserWindow): number => screen.getDisplayMatching(win.getBounds()).scaleFactor;

export { windowScale };
