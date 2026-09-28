/* @layer electron-main @kind logic */
import { ipcRenderer } from 'electron';
import type { InvokeMap, InvokeApi } from '@drizztdourden08/brock-core/ipc';

const buildInvoke = <M extends InvokeMap>(map: M): InvokeApi<M> =>
  Object.fromEntries(
    Object.entries(map).map(([method, channel]) => [method, (...args: unknown[]) => ipcRenderer.invoke(channel, ...args)]),
  ) as unknown as InvokeApi<M>;

export { buildInvoke };
