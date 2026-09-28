/* @layer electron-main @kind logic */
import { ipcRenderer } from 'electron';
import type { SendMap, SendApi } from '@drizztdourden08/brock-core/ipc';

const buildSend = <M extends SendMap>(map: M): SendApi<M> =>
  Object.fromEntries(
    Object.entries(map).map(([method, channel]) => [method, (...args: unknown[]) => { ipcRenderer.send(channel, ...args); }]),
  ) as unknown as SendApi<M>;

export { buildSend };
