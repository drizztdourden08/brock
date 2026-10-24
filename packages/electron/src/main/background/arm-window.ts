/* @layer electron-main @kind logic */
import type { BootstrapOptions, MainContext } from '../types/main-context.type';
import { enterBackground } from './enter-background';
import { skipsWindow } from './skips-window';
import { windowOpener } from './window-opener';

const armWindow = (ctx: MainContext, options: BootstrapOptions, openWindow: () => Promise<void>): (() => Promise<void>) => {
  windowOpener.current = openWindow;
  return async () => {
    if (await skipsWindow(ctx, options)) enterBackground();
    else await openWindow();
  };
};

export { armWindow };
