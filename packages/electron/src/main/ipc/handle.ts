/* @layer electron-main @kind logic */
import { ipcMain } from 'electron';
import type { HandleFn } from './handle.type';

const handle: HandleFn = (channel, fn) => {
  ipcMain.handle(channel, fn as never);
};

export { handle };
