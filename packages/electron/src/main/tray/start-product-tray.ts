/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';

const startProductTray = (ctx: MainContext): void => {
  const { tray } = ctx.product;
  if (tray && !ctx.flags.isAutomationLaunch()) ctx.tray.set(tray);
};

export { startProductTray };
