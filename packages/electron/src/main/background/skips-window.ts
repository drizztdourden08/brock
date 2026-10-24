/* @layer electron-main @kind logic */
import type { BootstrapOptions, MainContext } from '../types/main-context.type';

const skipsWindow = async (ctx: MainContext, options: BootstrapOptions): Promise<boolean> => {
  const decision = await options.beforeWindow?.(ctx);
  if (ctx.flags.isAutomationLaunch() && !ctx.flags.isBackgroundLaunch()) return false;
  if (decision === undefined) return ctx.flags.isBackgroundLaunch();
  return decision === 'skip';
};

export { skipsWindow };
