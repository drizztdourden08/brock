/* @layer electron-main @kind types */
import type { MainContext } from '../types/main-context.type';
import type { BridgeServer } from './bridge.type';

interface BridgeExtension {
  id: string;
  register: (bridge: BridgeServer, ctx: MainContext) => void | Promise<void>;
  openOnBoot?: boolean;
  maxMessageBytes?: number;
  maxBufferedBytes?: number;
}

interface BridgeExtensions {
  add: (extension: BridgeExtension) => () => void;
  list: () => BridgeExtension[];
  asksForBoot: () => boolean;
}

export type { BridgeExtension, BridgeExtensions };
