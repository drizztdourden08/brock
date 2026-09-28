/* @layer electron-main @kind logic */
import { ipcRenderer } from 'electron';
import type { SendFn } from './bridge.type';

const send: SendFn = (channel, ...args) => {
  ipcRenderer.send(channel, ...args);
};

export { send };
