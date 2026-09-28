/* @layer electron-main @kind logic */
import { ipcRenderer } from 'electron';
import type { InvokeFn } from './bridge.type';

const invoke: InvokeFn = (channel, ...args) => ipcRenderer.invoke(channel, ...args) as never;

export { invoke };
