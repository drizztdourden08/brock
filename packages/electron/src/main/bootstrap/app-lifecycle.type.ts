/* @layer electron-main @kind types */
import type { MainContext, MainModule } from '../types/main-context.type';

interface LifecycleInput {
  ctx: MainContext;
  modules: readonly MainModule[];
  onWillQuit?: (ctx: MainContext) => void;
  recreateWindow: () => void;
}

export type { LifecycleInput };
