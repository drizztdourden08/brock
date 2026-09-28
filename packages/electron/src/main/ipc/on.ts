/* @layer electron-main @kind logic */
import { ipcMain } from 'electron';
import type { OnFn } from './handle.type';

const on: OnFn = (channel, fn) => {
  ipcMain.on(channel, fn as never);
};

export { on };
