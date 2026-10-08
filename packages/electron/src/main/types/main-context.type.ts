/* @layer electron-main @kind types */
import type { BrowserWindow } from 'electron';
import type { ProductConfig, PrivilegedScheme } from '@drizztdourden08/brock-core/product';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { FileStore, DataDomainDef } from '@drizztdourden08/brock-core/platform';
import type { ProfileStore, ProfileStoreHooks } from '@drizztdourden08/brock-core/storage';
import type { AppServices, EventContract } from '@drizztdourden08/brock-core/augment';
import type { BootTask } from '@drizztdourden08/brock-core/boot';
import type { OpenRequest } from '@drizztdourden08/brock-core/types';
import type { ChannelArg, HandleFn, OnFn } from '../ipc/handle.type';
import type { JobRegistry, StartJob } from '../jobs/job.type';
import type { DataDomains } from '../storage/domain-files.type';
import type { BugReportOptions } from '../bug-report/bug-report.type';

type MainLogLevel = 'info' | 'warn' | 'error';

interface InstanceInfo {
  name: string | null;
  profile: string | null;
}

interface MainPaths {
  userData: (...segments: string[]) => string;
  data: (...segments: string[]) => string;
}

type EmitToWindow = <K extends keyof EventContract>(channel: ChannelArg<K>, ...args: Parameters<EventContract[K]>) => void;

interface MainContext {
  product: ProductConfig;
  isDev: boolean;
  flags: AutomationFlags;
  instance: InstanceInfo;
  paths: MainPaths;
  files: FileStore;
  profiles: ProfileStore;
  storage: DataDomains;
  job: StartJob;
  jobs: JobRegistry;
  window: () => BrowserWindow | null;
  handle: HandleFn;
  on: OnFn;
  emit: EmitToWindow;
  log: (message: string, level?: MainLogLevel) => void;
  onOpen: (handler: (request: OpenRequest) => void) => () => void;
  readonly services: AppServices;
}

type ServicesFactory = (ctx: MainContext) => AppServices | Promise<AppServices>;

interface MainModule {
  id: string;
  onBoot?: (product: ProductConfig) => void;
  register: (ctx: MainContext) => void | Promise<void>;
  onWindow?: (win: BrowserWindow, ctx: MainContext) => void;
  onWillQuit?: (ctx: MainContext) => void;
  automationFlags?: string[];
  dataDirs?: string[];
  schemes?: PrivilegedScheme[];
  bootTasks?: BootTask<MainContext>[];
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
  splashPreload?: string;
}

interface SecurityOptions {
  externalProtocols?: string[];
  permissions?: string[];
}

interface BootstrapOptions {
  modules?: MainModule[];
  handlers?: HandlerGroup[];
  services?: ServicesFactory;
  bootTasks?: BootTask<MainContext>[];
  automationFlags?: string[];
  dataDomains?: DataDomainDef[];
  profileHooks?: ProfileStoreHooks;
  rendererFlags?: (argv: string[]) => string[];
  onReady?: (ctx: MainContext) => void | Promise<void>;
  onWindow?: (win: BrowserWindow, ctx: MainContext) => void;
  onWillQuit?: (ctx: MainContext) => void;
  onOpen?: (request: OpenRequest, ctx: MainContext) => void;
  singleInstance?: boolean;
  bugReport?: BugReportOptions;
  paths?: BootstrapPaths;
  security?: SecurityOptions;
}

export type {
  MainLogLevel, InstanceInfo, MainPaths, EmitToWindow, MainContext, MainModule, HandlerGroup,
  BootstrapPaths, SecurityOptions, BootstrapOptions, ServicesFactory,
};
