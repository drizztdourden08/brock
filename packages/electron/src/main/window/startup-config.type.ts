/* @layer electron-main @kind types */
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { InstanceInfo } from '../types/main-context.type';

interface WindowSize {
  width: number;
  height: number;
}

interface StartupConfig {
  windowSize: WindowSize | null;
  fresh: boolean;
}

interface RendererArgsInput {
  config: StartupConfig;
  flags: AutomationFlags;
  instance: InstanceInfo;
  isDev: boolean;
  rendererFlags?: (argv: string[]) => string[];
  argv?: readonly string[];
}

type StartupMarkerInput = Omit<RendererArgsInput, 'rendererFlags' | 'argv'> & { argv: readonly string[] };

export type { WindowSize, StartupConfig, RendererArgsInput, StartupMarkerInput };
