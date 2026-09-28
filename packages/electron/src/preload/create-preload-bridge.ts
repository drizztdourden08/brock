/* @layer electron-main @kind logic */
import { contextBridge, webUtils } from 'electron';
import type { InvokeMap, SendMap, EventMap, IpcApi } from '@drizztdourden08/brock-core/ipc';
import type { BridgeTools, PreloadBridgeOptions } from './create-preload-bridge.type';
import { invoke } from './invoke';
import { send } from './send';
import { subscribe } from './subscribe';
import { buildInvoke } from './build-invoke';
import { buildSend } from './build-send';
import { buildEvents } from './build-events';
import { readStartupInfo } from './read-startup-info';
import { readInstanceInfo } from './read-instance-info';

const createPreloadBridge = <I extends InvokeMap, S extends SendMap, E extends EventMap>(
  options: PreloadBridgeOptions<I, S, E>,
): IpcApi<I, S, E> => {
  const { maps, namespaces = [], helpers = {}, exposeAs = 'api', debugGlobal } = options;
  const startup = readStartupInfo();
  const instance = readInstanceInfo();
  const isDev = startup.flags.dev === true;
  const os = process.platform;
  const tools: BridgeTools = { invoke, send, subscribe, startup, instance, isDev, os };

  const api: Record<string, unknown> = {
    isDev,
    os,
    getFilePath: (file: File) => webUtils.getPathForFile(file),
    startup,
    instance,
    ...helpers,
    ...buildInvoke(maps.invoke),
    ...buildSend(maps.send),
    ...buildEvents(maps.events),
  };

  for (const namespace of namespaces) {
    if (namespace.id in api) console.warn(`[preload] namespace "${namespace.id}" replaces an existing api member`);
    api[namespace.id] = namespace.build(tools);
  }

  contextBridge.exposeInMainWorld(exposeAs, api);
  if (debugGlobal) contextBridge.exposeInMainWorld(debugGlobal.name, debugGlobal.values);
  return api as unknown as IpcApi<I, S, E>;
};

export { createPreloadBridge };
