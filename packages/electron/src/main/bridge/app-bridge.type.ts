/* @layer electron-main @kind types */
import type { MainContext } from '../types/main-context.type';
import type { BridgeServer } from './bridge.type';

interface AppBridgeOptions {
  register: (bridge: BridgeServer, ctx: MainContext) => void | Promise<void>;
  maxMessageBytes?: number;
  maxClients?: number;
}

interface HelperLaunch {
  command: string;
  args: string[];
  env: Record<string, string>;
}

export type { AppBridgeOptions, HelperLaunch };
