/* @layer electron-main @kind types */
import type { ProductConfig } from '@drizztdourden08/brock-core/product';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { InstanceInfo, SecurityOptions } from '../types/main-context.type';

interface ResolvedPaths {
  preload: string;
  renderer: string;
  splash: string;
  splashPreload: string;
}

interface WindowSetup {
  product: ProductConfig;
  flags: AutomationFlags;
  instance: InstanceInfo;
  paths: ResolvedPaths;
  version: string;
  icon: string | undefined;
  rendererFlags?: (argv: string[]) => string[];
  security?: SecurityOptions;
}

export type { WindowSetup, ResolvedPaths };
