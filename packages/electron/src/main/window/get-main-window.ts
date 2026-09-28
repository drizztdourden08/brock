/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { mainWindowRef } from './main-window-ref';

const getMainWindow = (): BrowserWindow | null => mainWindowRef.current;

export { getMainWindow };
