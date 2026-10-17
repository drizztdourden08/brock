/* @layer electron-main @kind types */
import type { BrowserWindow } from 'electron';

type FullscreenTarget = Pick<BrowserWindow, 'getBounds' | 'setBounds'>;

export type { FullscreenTarget };
