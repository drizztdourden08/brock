/* @layer electron-main @kind types */
import type { MainContext } from '../types/main-context.type';
import type { BridgeServer } from './bridge.type';

interface AppBridgeOptions {
  register: (bridge: BridgeServer, ctx: MainContext) => void | Promise<void>;
  openOnBoot?: boolean;
  maxMessageBytes?: number;
  maxClients?: number;
  maxBufferedBytes?: number;
}

interface AppBridge {
  open: (options?: AppBridgeOptions) => Promise<BridgeServer>;
  close: () => void;
  current: () => BridgeServer | null;
  discoveryFile: () => string;
}

interface AppBridgeInput {
  options: AppBridgeOptions | null;
  file: () => string;
  ctx: () => MainContext;
}

interface AppBridgeStart {
  file: string;
  isCurrent: () => boolean;
}

interface OpenedAppBridge {
  server: BridgeServer;
  stop: () => void;
}

interface HelperLaunch {
  command: string;
  args: string[];
  env: Record<string, string>;
}

export type { AppBridge, AppBridgeInput, AppBridgeOptions, AppBridgeStart, HelperLaunch, OpenedAppBridge };
