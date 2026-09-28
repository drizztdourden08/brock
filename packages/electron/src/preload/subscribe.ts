/* @layer electron-main @kind logic */
import { ipcRenderer } from 'electron';
import type { IpcRendererEvent } from 'electron';
import type { SubscribeFn } from './bridge.type';

const subscribe: SubscribeFn = (channel, callback) => {
  const handler = (_event: IpcRendererEvent, ...args: unknown[]): void => {
    (callback as (...a: unknown[]) => void)(...args);
  };
  ipcRenderer.on(channel, handler);
  return () => { ipcRenderer.removeListener(channel, handler); };
};

export { subscribe };
