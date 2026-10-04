/* @layer electron-main @kind logic */
import { ipcMain } from 'electron';
import type { HandleFn } from './handle.type';
import { ipcCallCount } from './ipc-call-count';

const handle: HandleFn = (channel, fn) => {
  const counted = (...args: unknown[]): unknown => {
    ipcCallCount.total += 1;
    return (fn as (...a: unknown[]) => unknown)(...args);
  };
  ipcMain.handle(channel, counted);
};

export { handle };
