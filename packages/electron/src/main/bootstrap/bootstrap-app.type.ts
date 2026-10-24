/* @layer electron-main @kind types */
import type { PrivilegedScheme } from '@drizztdourden08/brock-core/product';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { BootstrapOptions, MainContext } from '../types/main-context.type';
import type { WindowSetup } from '../window/window-setup.type';

interface ReadyInput {
  ctx: MainContext;
  options: BootstrapOptions;
  dataDirs: string[];
  schemes: PrivilegedScheme[];
  setup: WindowSetup;
}

interface ProcessStart {
  flags: AutomationFlags;
  portableData: string | null;
  userDataOverride: string | null;
}

export type { ProcessStart, ReadyInput };
