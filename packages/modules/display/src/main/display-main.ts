/* @layer electron-main @kind logic */
import { memoByContext } from '@drizztdourden08/brock-electron/context';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { DisplayMain } from './display-main.type';
import { buildDisplayModeDriver } from './drivers/build-display-mode-driver';
import { createLazyDriver } from './drivers/create-lazy-driver';
import { createSyncedRate } from './synced-rate/create-synced-rate';
import { createWindowModeControl } from './window-mode/create-window-mode-control';

const createDisplayMain = (ctx: MainContext): DisplayMain => {
  const headless = ctx.flags.isHeadlessLaunch();
  const driver = createLazyDriver(() => buildDisplayModeDriver(headless));
  return { driver, syncedRate: createSyncedRate(driver), windowMode: createWindowModeControl(ctx.window, headless) };
};

const getDisplay = memoByContext<MainContext, DisplayMain>(createDisplayMain);

export { getDisplay };
