/* @layer electron-main @kind logic */
import { ipcMain } from 'electron';
import type { OnFn } from './handle.type';
import { ipcCallCount } from './ipc-call-count';

const on: OnFn = (channel, fn) => {
  const counted = (...args: unknown[]): void => {
    ipcCallCount.total += 1;
    (fn as (...a: unknown[]) => void)(...args);
  };
  ipcMain.on(channel, counted);
};

export { on };
