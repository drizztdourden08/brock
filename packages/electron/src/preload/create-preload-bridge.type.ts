/* @layer electron-main @kind types */
import type { InvokeMap, SendMap, EventMap, StartupInfo, InstanceInfo } from '@drizztdourden08/brock-core/ipc';
import type { InvokeFn, SendFn, SubscribeFn } from './bridge.type';

interface BridgeTools {
  invoke: InvokeFn;
  send: SendFn;
  subscribe: SubscribeFn;
  startup: StartupInfo;
  instance: InstanceInfo;
  isDev: boolean;
  os: NodeJS.Platform;
}

interface PreloadNamespace {
  id: string;
  build: (tools: BridgeTools) => object;
}

interface DebugGlobal {
  name: string;
  values: Record<string, string | null>;
}

interface PreloadBridgeOptions<I extends InvokeMap, S extends SendMap, E extends EventMap> {
  maps: { invoke: I; send: S; events: E };
  namespaces?: PreloadNamespace[];
  helpers?: Record<string, unknown>;
  exposeAs?: string;
  debugGlobal?: DebugGlobal;
}

export type { BridgeTools, PreloadNamespace, DebugGlobal, PreloadBridgeOptions };
