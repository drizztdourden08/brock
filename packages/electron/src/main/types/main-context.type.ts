/* @layer electron-main @kind types */
import type { BrowserWindow } from 'electron';
import type { ProductConfig, PrivilegedScheme, ProductIcons } from '@drizztdourden08/brock-core/product';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { FileStore, DataDomainDef } from '@drizztdourden08/brock-core/platform';
import type { ProfileStore, ProfileStoreHooks } from '@drizztdourden08/brock-core/storage';
import type { EventContract } from '@drizztdourden08/brock-core/augment';
import type { HandleFn, OnFn } from '../ipc/handle.type';

type MainLogLevel = 'info' | 'warn' | 'error';

interface InstanceInfo {
  name: string | null;
  profile: string | null;
}

interface MainPaths {
  userData: (...segments: string[]) => string;
  data: (...segments: string[]) => string;
}

type EmitToWindow = <K extends keyof EventContract>(channel: K, ...args: Parameters<EventContract[K]>) => void;

interface MainContext {
  product: ProductConfig;
  isDev: boolean;
  flags: AutomationFlags;
  instance: InstanceInfo;
  paths: MainPaths;
  files: FileStore;
  profiles: ProfileStore;
  window: () => BrowserWindow | null;
  handle: HandleFn;
  on: OnFn;
  emit: EmitToWindow;
  log: (message: string, level?: MainLogLevel) => void;
}

interface MainModule {
  id: string;
  onBoot?: (product: ProductConfig) => void;
  register: (ctx: MainContext) => void | Promise<void>;
  onWindow?: (win: BrowserWindow, ctx: MainContext) => void;
  onWillQuit?: (ctx: MainContext) => void;
  automationFlags?: string[];
  dataDirs?: string[];
  schemes?: PrivilegedScheme[];
}

interface HandlerGroup {
  id: string;
  register: (ctx: MainContext) => void;
  devOnly?: boolean;
}

interface BootstrapPaths {
  preload?: string;
  renderer?: string;
  splash?: string;
}

interface SecurityOptions {
  externalProtocols?: string[];
  permissions?: string[];
}

interface BootstrapOptions {
  modules?: MainModule[];
  handlers?: HandlerGroup[];
  automationFlags?: string[];
  dataDomains?: DataDomainDef[];
  profileHooks?: ProfileStoreHooks;
  rendererFlags?: (argv: string[]) => string[];
  onReady?: (ctx: MainContext) => void | Promise<void>;
  onWindow?: (win: BrowserWindow, ctx: MainContext) => void;
  onWillQuit?: (ctx: MainContext) => void;
  paths?: BootstrapPaths;
  security?: SecurityOptions;
  instanceIcons?: ProductIcons;
}

export type {
  MainLogLevel, InstanceInfo, MainPaths, EmitToWindow, MainContext, MainModule, HandlerGroup,
  BootstrapPaths, SecurityOptions, BootstrapOptions,
};
