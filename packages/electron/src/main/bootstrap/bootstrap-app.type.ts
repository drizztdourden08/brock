/* @layer electron-main @kind types */
import type { BootstrapOptions, MainContext } from '../types/main-context.type';
import type { WindowSetup } from '../window/window-setup.type';

interface ReadyInput {
  ctx: MainContext;
  options: BootstrapOptions;
  dataDirs: string[];
  setup: WindowSetup;
}

export type { ReadyInput };
