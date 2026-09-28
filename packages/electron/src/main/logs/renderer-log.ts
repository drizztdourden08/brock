/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { RendererLogger } from './renderer-log.type';
import { emit } from '../ipc/emit';

const createRendererLogger = (getWindow: () => BrowserWindow | null): RendererLogger =>
  (channel, level, message) => {
    const win = getWindow();
    if (win) emit(win, 'log:entry', { channel, level, message });
  };

export { createRendererLogger };
